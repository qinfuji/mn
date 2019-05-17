package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ChancePointEstimateService;
import com.mn.modules.api.utils.Tools;
import com.mn.modules.api.vo.Quota;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class ChancePointEstimateServiceImpl  implements ChancePointEstimateService {

    private Logger LOG = LoggerFactory.getLogger(ChancePointEstimateServiceImpl.class);

    private static final String APPID = "topdata20190001";
    private static final String TOKEN = "ahxop4yvqar1gbizumx2rpy98kp2ev";
    private static final String HOST = "http://bi.topprism.com/api/fromhcr";

    @Autowired
    RestTemplate restTemplate;


    private void  request(String account , String path , Map requestParam , Function<JSONObject , Void> callback){

        requestParam.put("appid" , APPID);
        Map signParamMap = Tools.sign(requestParam , TOKEN);
        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        signParamMap.forEach((key, value) -> {
            requestMap.add((String) key, (String) value);
        });
        ResponseEntity<String> responseBody = restTemplate.postForEntity(HOST + path, requestMap, String.class);
        String responseString = responseBody.getBody();
        try {
            JSONObject jsonObject = JSON.parseObject(responseString);
            Integer code = jsonObject.getInteger("code");
            if (code != 0) {
                LOG.error("获取用户省编码失败 ， account:%s , reason: %s", account, jsonObject.getString("msg"));
                throw new RuntimeException("请求错误");
            } else {
                JSONObject data = jsonObject.getJSONObject("data");
                callback.apply(data);
            }
        } catch (Exception err) {
            throw new RuntimeException("");
        }
    }


    @Override
    public Quota getBusinessCirclePopulation(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessCircleActive(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessCircleActiveTop(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictPopulation(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictCustomerActive(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictCustomerChildrenProportion(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictActive(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictMating(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictBusNum(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictActiveTop(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictMatingTop(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getBusinessDistrictBusTop(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getStreetMating(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }

    @Override
    public Quota getStreetTop(String userAccount, ChancePoint chancePoint, Date date) {
        return null;
    }
}
