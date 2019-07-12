package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mn.modules.api.dao.PointerAddressLabelsDao;
import com.mn.modules.api.dao.SharePointerAddressDao;
import com.mn.modules.api.entity.PointerAddressLabel;
import com.mn.modules.api.entity.SharePointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.SharePointerAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SharePointerAddressServiceImpl extends ServiceImpl<SharePointerAddressDao, SharePointerAddress> implements SharePointerAddressService {


    @Autowired
    private PointerAddressLabelsDao pointerAddressLabelsDao;

    @Override
    public List<SharePointerAddress> query(PointerAddressQuery pq) {
         return this.baseMapper.querySharePointerAddressList(pq);
    }

    @Override
    public SharePointerAddress createPointerAddress(SharePointerAddress pointerAddress) {
        this.baseMapper.insert(pointerAddress);

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
}
