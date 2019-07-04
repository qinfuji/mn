package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mn.modules.api.dao.PointerAddressDao;
import com.mn.modules.api.dao.PointerAddressLabelsDao;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.entity.PointerAddressLabel;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class PointerAddressServiceImpl implements PointerAddressService {


    @Autowired
    private PointerAddressDao pointerAddressDao;

    @Autowired
    private PointerAddressLabelsDao pointerAddressLabelsDao;


    public PointerAddressServiceImpl() {
    }


    public PointerAddressServiceImpl(PointerAddressDao pointerAddressDao) {
        this.pointerAddressDao = pointerAddressDao;
    }

    @Override
    public PointerAddress createPointerAddress(PointerAddress pointerAddress) {
        pointerAddress.setState(STATUS_WAIT_SUBMIT); //等待提交
        pointerAddressDao.insert(pointerAddress);

        String labels = pointerAddress.getLabels();
        if(!"".equals(labels) && labels!=null){
              String[] labelArray = labels.split(",");
              for (String label : labelArray){
                  PointerAddressLabel pal = new PointerAddressLabel();
                  pal.setLabelId(Integer.parseInt(label));
                  pal.setPointerAddressId(pointerAddress.getId());
                  pointerAddressLabelsDao.insert(pal);
              }
        }
        return pointerAddress;
    }

    @Override
    public PointerAddress queryPointerAddress(String id) {
        return pointerAddressDao.selectById(id);
    }

    @Override
    public PointerAddress updatePointerAddress(PointerAddress pointerAddress) {
        pointerAddressDao.updateById(pointerAddress);
        String labels = pointerAddress.getLabels();
        if(!"".equals(labels) && labels!=null){
            //首先删除所有标签，在创建
            QueryWrapper qw = new QueryWrapper<PointerAddress>();
            qw.eq("pointerAddressId" , pointerAddress.getId());
            pointerAddressLabelsDao.delete(qw);
            String[] labelArray = labels.split(",");

            for (String label : labelArray){
                PointerAddressLabel pal = new PointerAddressLabel();
                pal.setLabelId(Integer.parseInt(label));
                pal.setPointerAddressId(pointerAddress.getId());
                pointerAddressLabelsDao.insert(pal);
            }
        }
        return pointerAddressDao.selectById(pointerAddress.getId());
    }

    @Override
    public boolean invalidPointerAddress(PointerAddress pointerAddress) {
        PointerAddress cp = new PointerAddress();
        cp.setState(STATUS_DELETE); //逻辑删除
        cp.setId(pointerAddress.getId());
        cp.setVersion(pointerAddress.getVersion());
        pointerAddressDao.updateById(cp);
        return true;
    }

    @Override
    public IPage<PointerAddress> getPointerAddressList(PointerAddressQuery qo, UserInfo userInfo) {

        if("".equals(qo.getLabels()) || qo.getLabels()!=null){

            QueryWrapper<PointerAddress> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("organizationId", userInfo.getOrganizationId());
            if ("".equals(qo.getAddress()) && qo.getAddress() != null) {
                queryWrapper.like("address", qo.getAddress());
            }
            //无效状态的不显示
            queryWrapper.ne("state", STATUS_DELETE);
            if ("".equals(qo.getScope()) && qo.getScope() != null) {
                if (AREA_SCOPE_PROVINCE.equals(qo.getScope())) {
                    queryWrapper.eq("province", qo.getAdcode());
                } else if (AREA_SCOPE_CITY.equals(qo.getScope())) {
                    queryWrapper.eq("city", qo.getAdcode());
                } else if (AREA_SCOPE_DISTRICT.equals(qo.getScope())) {
                    queryWrapper.eq("district", qo.getAdcode());
                }
            }
            IPage pageParam = new Page(qo.getPageIndex(), qo.getPageSize());
            IPage page = pointerAddressDao.selectPage(pageParam, queryWrapper);
            return page;
        }else{
            pointerAddressDao.queryPointerAddressList(qo, userInfo);
        }
        return null;
    }
}
