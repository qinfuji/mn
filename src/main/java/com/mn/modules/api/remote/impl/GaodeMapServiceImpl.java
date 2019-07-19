package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.entity.GeographyPoint;
import com.mn.modules.api.remote.GaodeMapService;
import com.mn.modules.api.utils.LngLat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class GaodeMapServiceImpl implements GaodeMapService {

    private static Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private static final String GET_ADDRESS_URL = "https://restapi.amap.com/v3/geocode/regeo";

    //高德地址web服务key
    private static final String KEY = "557502179bf8fc981e4f629b75411025";

    @Autowired
    RestTemplate restTemplate;

    AdcodeData adcodeData = new AdcodeData();


    @Override
    public GeographyPoint getGeographyPointByLnglat(LngLat lnglat) throws Exception{


        try{
            MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
            System.out.println(lnglat.getLng()+","+lnglat.getLat());
            System.out.println(116.29814819105682);
            String url = GET_ADDRESS_URL+"?key="+KEY+"&location="+lnglat.getLng()+","+lnglat.getLat();
            System.out.println(url);
            ResponseEntity<String>  responseBody = restTemplate.getForEntity(url, String.class , requestMap);
            String responseString = responseBody.getBody();
            if(logger.isInfoEnabled()){
                logger.info("用户请求： {}", responseString);
            }
            JSONObject jsonObject = JSON.parseObject(responseString);
            Integer state = jsonObject.getInteger("status");
            if(state.intValue() !=1){
                String info = jsonObject.getString("info");
                logger.error("用户请求： {}", info);
                return null;
            }

            JSONObject regeocodes = jsonObject.getJSONObject("regeocode");
            JSONObject addressComponent = regeocodes.getJSONObject("addressComponent");
            String address = regeocodes.getString("formatted_address");

            String district = addressComponent.getString("adcode");


            GeographyPoint gp =  adcodeData.getCodeInfo(district);
            gp.setLng(lnglat.getLng());
            gp.setLat(lnglat.getLat());
            gp.setAddress(address);

            return gp;
        }catch(Exception err){
             throw new Exception("获取信息失败" , err);
        }
    }
}
