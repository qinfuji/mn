package com.mn.modules.api.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mn.modules.api.dao.CategroyLabelDao;
import com.mn.modules.api.dao.PointerAddressLabelsDao;
import com.mn.modules.api.dao.SharePointerAddressDao;
import com.mn.modules.api.entity.*;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.remote.GaodeMapService;
import com.mn.modules.api.service.CategroyLabelService;
import com.mn.modules.api.service.SharePointerAddressService;
import com.mn.modules.api.utils.GeometryUtil;
import com.mn.modules.api.utils.LngLat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class SharePointerAddressServiceImpl extends ServiceImpl<SharePointerAddressDao, SharePointerAddress> implements SharePointerAddressService {


    private static Logger logger = LoggerFactory.getLogger(SharePointerAddressServiceImpl.class);


    @Autowired
    private PointerAddressLabelsDao pointerAddressLabelsDao;

    @Autowired
    CategroyLabelDao categroyLabelDao;

    @Autowired
    GaodeMapService gaodeMapService;

    @Override
    public List<SharePointerAddress> query(PointerAddressQuery pq) {
        return this.baseMapper.querySharePointerAddressList(pq);
    }

    @Override
    public SharePointerAddress createPointerAddress(SharePointerAddress pointerAddress) {
        this.baseMapper.insert(pointerAddress);

        String labels = pointerAddress.getLabels();
        if (!"".equals(labels) && labels != null) {
            String[] labelArray = labels.split(",");
            for (String label : labelArray) {
                PointerAddressLabel pal = new PointerAddressLabel();
                pal.setLabelId(label);
                pal.setPointerAddressId(pointerAddress.getId());
                pointerAddressLabelsDao.insert(pal);
            }
        }
        return pointerAddress;
    }

    @Override
    public void importSharePointerAddresses(String[][] data) {

        if (data == null || data.length == 0) {
            return;
        }
        //创建根label
        QueryWrapper<CategroyLabel> categroyLabelQueryWrapper = new QueryWrapper<>();
        categroyLabelQueryWrapper.eq("label" , "通用标签");
        categroyLabelQueryWrapper.isNull("parent_id");
        CategroyLabel categroyLabel =  categroyLabelDao.selectOne(categroyLabelQueryWrapper);
        if(categroyLabel == null){
            categroyLabel = new CategroyLabel();
            categroyLabel.setState(CategroyLabelService.STATE_NORMAL);
            categroyLabel.setLabel("通用标签");
            categroyLabelDao.insert(categroyLabel);
        }
        Map<String , String> labelMap = new HashMap<>();

        for (int i = 0; i < data.length; i++) {
            try{
                String[] line = data[i];
                String label = line[0];
                String name = line[1];
                String fence = line[2];
                String labelKey = labelMap.get(label);
                if(labelKey == null){
                    CategroyLabel _categroyLabel = new CategroyLabel();
                    _categroyLabel.setState(CategroyLabelService.STATE_NORMAL);
                    _categroyLabel.setLabel(label);
                    _categroyLabel.setParentId(categroyLabel.getId());
                    categroyLabelDao.insert(_categroyLabel);
                    labelKey = _categroyLabel.getId();
                    labelMap.put(label , labelKey);
                }
                JSONArray fenceArray = JSONArray.parseArray(fence);
                List<LngLat> lnglats = new ArrayList<>();
                if(fenceArray.size()>0){
                    for (int j = 0; j < fenceArray.size(); j++) {
                        JSONArray lnglatJson = fenceArray.getJSONArray(j);
                        double lng = lnglatJson.getDouble (0);
                        double lat = lnglatJson.getDouble(1);
                        LngLat lngLat = new LngLat(lng , lat);
                        lnglats.add(lngLat);
                    }
                }
                //获取围栏中心
                String fenceString = "";
                System.out.println(lnglats);
                for(Iterator<LngLat> iterator = lnglats.iterator() ; iterator.hasNext();){
                    LngLat ll =  iterator.next();
                    fenceString += (ll.getLng()+","+ll.getLat());
                    if(iterator.hasNext()){
                        fenceString+=";";
                    }
                }
                System.out.println(fenceString);
                LngLat center = GeometryUtil.getCenterOfGravityPoint(lnglats);
                System.out.println(center);
                GeographyPoint gp = gaodeMapService.getGeographyPointByLnglat(center);
                SharePointerAddress spa = new SharePointerAddress();
                spa.setLabels(labelKey);
                spa.setName(name);
                spa.setLng(center.getLng());
                spa.setLat(center.getLat());
                spa.setCity(gp.getCity());
                spa.setCityName(gp.getCityName());
                spa.setProvince(gp.getProvince());
                spa.setProvinceName(gp.getProvinceName());
                spa.setDistrict(gp.getDistrict());
                spa.setDistrictName(gp.getDistrictName());
                spa.setFence(fenceString);
                spa.setCreatedTime(new Date());
                spa.setLastUpdatedTime(new Date());
                spa.setAddress(gp.getAddress());
                this.baseMapper.insert(spa);

                PointerAddressLabel pal = new PointerAddressLabel();
                pal.setPointerAddressId(spa.getId());
                pal.setLabelId(labelKey);
                this.pointerAddressLabelsDao.insert(pal);

            }catch(Exception error){
                logger.error("import err , line {} , {}" , i+1 , error.getMessage());
            }
        }
    }
}
