package com.mn.modules.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.utils.Tools;
import com.mn.modules.api.vo.EstimateResult;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TestChancePointController extends BaseTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private ChancePointDao dao;

    @BeforeEach // 在测试开始前初始化工作
    @Before
    public void setup() {

        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    String appId = "hcr000001";


    private String getToken() throws Exception {
        try {

            Map<String, String> map = new HashMap<>();
            map.put("appId", appId);
            Map<String, String> reqMap = Tools.sign(map);
            MvcResult result = mockMvc.perform(post("/api/gettoken")
                    .param("appId", reqMap.get("appId"))
                    .param("sign", reqMap.get("sign"))
                    .param("timestamp", reqMap.get("timestamp")))
                    .andExpect(status().isOk())// 模拟向testRest发送get请求
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))// 预期返回值的媒体类型text/plain;charset=UTF-8
                    .andReturn();// 返回执行请求的结果

            String responseString =  result.getResponse().getContentAsString();
            JSONObject json =  JSONObject.parseObject(responseString);
            return json.getString("token");

        } catch (Exception error) {
            throw error;
        }
    }

    @Test
    public void testCreateChancePoint() throws Exception {
        String token = getToken();
        ChancePoint chancePoint = getTempChancePoint();
        MvcResult result = mockMvc.perform(post("/api/chance/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(chancePoint)).header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();

        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(jo.getInteger("code").intValue() , 0) ;
        ChancePoint cp =  jo.getObject("data" , ChancePoint.class);
        Assert.assertEquals(cp.getAppId() , appId);
        Assert.assertNotEquals(cp.getId() , null);
    }

    @Test
    public void testUpdateChance() throws Exception{

        ChancePoint chancePoint = getTempChancePoint();
        dao.insert(chancePoint);
        Assert.assertNotEquals(null , chancePoint.getId());
        String token = getToken();

        ChancePoint updateChancePoint = new ChancePoint();
        updateChancePoint.setId(chancePoint.getId());
        updateChancePoint.setAppId(appId);
        updateChancePoint.setAddress("湖北省潜江市");
        MvcResult result = mockMvc.perform(put("/api/chance/update/"+chancePoint.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(updateChancePoint))
                .header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        ChancePoint dbChancePoint =  dao.selectById(chancePoint.getId());
        Assert.assertEquals("湖北省潜江市" , dbChancePoint.getAddress());
    }

    @Test
    public void testGetChancePointList() throws  Exception {
        for (int i = 0; i < 50; i++) {
            ChancePoint chancePoint = getTempChancePoint();
            chancePoint.setAppId(appId);
            chancePoint.setProvince("10000001");
            dao.insert(chancePoint);
        }

        String token = getToken();
        IPage page = new Page(1,10);
        MvcResult result = mockMvc.perform(get("/api/chance/list/province/10000001")
                .contentType(MediaType.APPLICATION_JSON)
                .param("currentPage" , "1")
                .param("pageSize" , "10")
                .header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        JSONObject jo = JSONObject.parseObject(result.getResponse().getContentAsString());
        int code = jo.getInteger("code");
        Assert.assertEquals(0 , code);
        IPage ret =  jo.getObject("data" , IPage.class);
        Assert.assertEquals(10 , ret.getRecords().size());
        Assert.assertEquals(50 , ret.getTotal());
        JSONObject cp = (JSONObject) ret.getRecords().get(0);
        Assert.assertEquals(appId , cp.getString("appId"));


    }


    /**
     * 直辖市测试
     * @throws Exception
     */
    @Test
    public void testQueryEstimateResults() throws  Exception{
        ChancePoint chancePoint = getTempChancePoint();
        chancePoint.setAppId(appId);
        chancePoint.setShopId(null);
        chancePoint.setProvince("10000001");
        chancePoint.setLng(116.4795723047);
        chancePoint.setLat(39.8450571607);
        chancePoint.setProvinceName("北京市");
        chancePoint.setCityName("朝阳区");
        dao.insert(chancePoint);
        String token = getToken();
        MvcResult result = mockMvc.perform(get("/api/chance/"+chancePoint.getId()+"/estimates")
                .contentType(MediaType.APPLICATION_JSON)
                .param("userAccount" , "hcrf0380")
                .header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        JSONObject jo = JSONObject.parseObject(result.getResponse().getContentAsString());
        int code = jo.getInteger("code");
        Assert.assertEquals(0 , code);
        List<EstimateResult> ret = jo.getObject("data" , new TypeReference<List<EstimateResult>>(){});
        Assert.assertEquals(3 ,ret.size());

    }


    /**
     * 非直辖市测试
     * @throws Exception
     */
    @Test
    public void testQueryEstimateResults1() throws  Exception{
        ChancePoint chancePoint = getTempChancePoint();
        chancePoint.setAppId(appId);
        chancePoint.setShopId(null);
        chancePoint.setProvince("10000001");
        chancePoint.setLng(114.2690740918);
        chancePoint.setLat(30.6297346021);
        chancePoint.setProvinceName("湖北省");
        chancePoint.setCityName("武汉市");
        dao.insert(chancePoint);
        String token = getToken();
        MvcResult result = mockMvc.perform(get("/api/chance/"+chancePoint.getId()+"/estimates")
                .contentType(MediaType.APPLICATION_JSON)
                .param("userAccount" , "hcrf0366")
                .header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        JSONObject jo = JSONObject.parseObject(result.getResponse().getContentAsString());
        int code = jo.getInteger("code");
        Assert.assertEquals(0 , code);
        List<EstimateResult> ret = jo.getObject("data" , new TypeReference<List<EstimateResult>>(){});
        Assert.assertEquals(3 ,ret.size());

    }
}
