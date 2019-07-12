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
import org.springframework.transaction.annotation.Transactional;

import java.util.Iterator;
import java.util.List;


@Service
@Transactional
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
        pointerAddressDao.insert(pointerAddress);

        String labels = pointerAddress.getLabels();
        if(!"".equals(labels) && labels!=null){
              String[] labelArray = labels.split(",");
              for (String label : labelArray){
                  PointerAddressLabel pal = new PointerAddressLabel();
                  pal.setLabelId(label);
                  pal.setPointerAddressId(pointerAddress.getId());
                  pointerAddressLabelsDao.insert(pal);
              }
        }
        return pointerAddress;
    }

    @Override
    public PointerAddress queryPointerAddress(String id) {
        PointerAddress pa =  pointerAddressDao.selectById(id);
        QueryWrapper<PointerAddressLabel> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("pointer_address_id" , pa.getId());
        List<PointerAddressLabel> pointerAddressLabelList = pointerAddressLabelsDao.selectList(queryWrapper);
        String labels = "";
        Iterator<PointerAddressLabel> t = pointerAddressLabelList.iterator();
        while(t.hasNext()){
            labels += t.next().getLabelId();
            if(t.hasNext()){
                labels +=",";
            }
        }
        pa.setLabels(labels);
        return pa;
    }

    @Override
    public PointerAddress updatePointerAddress(PointerAddress pointerAddress) {
        pointerAddressDao.updateById(pointerAddress);
        String labels = pointerAddress.getLabels();
        if(!"".equals(labels) && labels!=null){
            //首先删除所有标签，在创建
            QueryWrapper qw = new QueryWrapper<PointerAddress>();
            qw.eq("pointer_address_id" , pointerAddress.getId());
            pointerAddressLabelsDao.delete(qw);
            String[] labelArray = labels.split(",");

            for (String label : labelArray){
                PointerAddressLabel pal = new PointerAddressLabel();
                pal.setLabelId(label);
                pal.setPointerAddressId(pointerAddress.getId());
                pointerAddressLabelsDao.insert(pal);
            }
        }
        PointerAddress ret =  pointerAddressDao.selectById(pointerAddress.getId());
        ret.setLabels(labels);
        return ret;
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
    public IPage<PointerAddress> getPointerAddressList( PointerAddressQuery qo, UserInfo userInfo) {
           IPage page = new Page(qo.getPageIndex() , qo.getPageSize());
           return pointerAddressDao.queryPointerAddressList(page ,qo, userInfo);
    }
}
