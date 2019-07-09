package com.mn.modules.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.interceptor.TestTokenInterceptor;
import com.mn.modules.api.service.EstimateTaskService;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.PointerAddressAndEstimateTask;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TestEstimateTaskController extends BaseTest {

    @Autowired
    EstimateTaskController estimateTaskController;

    @Autowired
    PointerAddressService pointerAddressService;

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @BeforeEach // 在测试开始前初始化工作
    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    private String getToken() {
        return "token";
    }


    public PointerAddress getTmpPointerAddress(){
        String token = getToken();
        PointerAddress pointerAddress = new PointerAddress();
        pointerAddress.setAddress("北京市朝阳区");
        pointerAddress.setType(PointerAddressService.TYPPE_CHANCE);
        pointerAddress.setName("测试点址");
        pointerAddress.setState(PointerAddressService.STATUS_WAIT_SUBMIT);
        pointerAddress.setLat(1.1);
        pointerAddress.setLng(1.1);
        pointerAddress.setCity("100000");
        pointerAddress.setCityName("100000");
        pointerAddress.setProvince("100000");
        pointerAddress.setProvinceName("100000");
        pointerAddress.setDistrict("100000");
        pointerAddress.setDistrictName("100000");
        pointerAddress.setLabels("1");
        pointerAddress.setOrganizationId(TestTokenInterceptor.organizationId);
        return pointerAddress;

    }

    @Test
    public void testEstimateTaskCreate()  throws Exception{
        PointerAddress pa = getTmpPointerAddress();
        pointerAddressService.createPointerAddress(pa);
        EstimateTask et = new EstimateTask();
        et.setPointerAddressId(pa.getId());
        et.setFilterLabels("1,2,3");
        et.setObserveId("1");
        et.setDistance(3000);

        MvcResult result = mockMvc.perform(post("/api/estimateTask/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        System.out.println(responseString);
        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        EstimateTask dbet =  jo.getObject("data" , EstimateTask.class);
        Assert.assertNotEquals(null , dbet.getId());
        Assert.assertEquals(EstimateTaskService.STATUS_WAIT_COMMIT, dbet.getState().intValue());


        MvcResult validEtResponse = mockMvc.perform(get("/api/estimateTask/querybyPointerAddressId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("paId" , pa.getId())
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        responseString = validEtResponse.getResponse().getContentAsString();
        System.out.println(responseString);
        jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        dbet =  jo.getObject("data" , EstimateTask.class);
        Assert.assertEquals(null ,dbet) ;
    }


    /**
     * 用户不正常
     * @throws Exception
     */
    @Test
    public void testEstimateTaskCreateNotGrant()  throws Exception{
        PointerAddress pa = getTmpPointerAddress();
        pa.setOrganizationId("xxxxx");
        pointerAddressService.createPointerAddress(pa);
        EstimateTask et = new EstimateTask();
        et.setPointerAddressId(pa.getId());
        et.setFilterLabels("1,2,3");
        et.setObserveId("1");
        et.setDistance(3000);

        MvcResult result = mockMvc.perform(post("/api/estimateTask/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        System.out.println(responseString);
        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(500 ,jo.getInteger("code").intValue()) ;

    }


    @Test
    public void testEstimateTaskSubmit()  throws Exception{
        PointerAddress pa = getTmpPointerAddress();
        pointerAddressService.createPointerAddress(pa);
        EstimateTask et = new EstimateTask();
        et.setPointerAddressId(pa.getId());
        et.setFilterLabels("1,2,3");
        et.setObserveId("1");
        et.setDistance(3000);

        MvcResult result = mockMvc.perform(post("/api/estimateTask/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        System.out.println(responseString);
        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        EstimateTask dbet =  jo.getObject("data" , EstimateTask.class);
        Assert.assertEquals(EstimateTaskService.STATUS_COMMITED ,dbet.getState().intValue()) ;

        MvcResult validEtResponse = mockMvc.perform(get("/api/estimateTask/querybyPointerAddressId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("paId" , pa.getId())
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        responseString = validEtResponse.getResponse().getContentAsString();
        System.out.println(responseString);
        jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        dbet =  jo.getObject("data" , EstimateTask.class);
        Assert.assertNotEquals(null ,dbet) ;
    }

    @Test
    public void testDelete() throws Exception{
        PointerAddress pa = getTmpPointerAddress();
        pointerAddressService.createPointerAddress(pa);
        EstimateTask et = new EstimateTask();
        et.setPointerAddressId(pa.getId());
        et.setFilterLabels("1,2,3");
        et.setObserveId("1");
        et.setDistance(3000);

        MvcResult submitResult =  mockMvc.perform(post("/api/estimateTask/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = submitResult.getResponse().getContentAsString();

        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        EstimateTask dbet =  jo.getObject("data" , EstimateTask.class);

        MvcResult result = mockMvc.perform(delete("/api/estimateTask/delete/"+dbet.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        jo = JSONObject.parseObject(result.getResponse().getContentAsString());
        int code = jo.getInteger("code");
        Assert.assertEquals(0 , code);

        MvcResult validEtResponse = mockMvc.perform(get("/api/estimateTask/querybyPointerAddressId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("paId" , pa.getId())
                .content(JSONObject.toJSONString(et)).header("token" , getToken()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        responseString = validEtResponse.getResponse().getContentAsString();
        System.out.println(responseString);
        jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        PointerAddressAndEstimateTask dbet1 =  jo.getObject("data" , PointerAddressAndEstimateTask.class);
        Assert.assertEquals(null ,dbet1.getEstimateTask()) ;

    }
}
