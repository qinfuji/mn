package com.mn.modules.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.jsonzou.jmockdata.JMockData;
import com.github.jsonzou.jmockdata.MockConfig;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.PointerAddressDao;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.interceptor.TestTokenInterceptor;
import com.mn.modules.api.service.PointerAddressService;
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

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TestPointerAddressController extends BaseTest {


    protected final MockConfig POINTER_ADDRESS_MOCK_CONFIG = new MockConfig()
            .globalConfig().excludes("id");

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private PointerAddressDao dao;

    @BeforeEach // 在测试开始前初始化工作
    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    private String getToken() {
         return "token";
    }


    public PointerAddress getTempPointerAddress(){
        PointerAddress cp = new PointerAddress();
        return JMockData.mock(PointerAddress.class, POINTER_ADDRESS_MOCK_CONFIG);
    }

    @Test
    public void testCreatePointerAddress() throws Exception {
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
        pointerAddress.setLabels("商业中心");

        MvcResult result = mockMvc.perform(post("/api/pointerAddress/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(pointerAddress)).header("token" , token))

                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        PointerAddress cp =  jo.getObject("data" , PointerAddress.class);
        Assert.assertNotEquals(null , cp.getOrganizationId());
        Assert.assertNotEquals(null , cp.getId());
        Assert.assertNotEquals(null , cp.getCreatedTime());
        Assert.assertNotEquals(null , cp.getLastUpdatedTime());
        Assert.assertNotEquals(null , cp.getVersion());
    }

    @Test
    public void testUpdatePointerAddress() throws Exception{
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
        pointerAddress.setLabels("商业中心");
        pointerAddress.setOrganizationId(TestTokenInterceptor.organizationId);
        pointerAddress.setCreatedTime(new Date());
        pointerAddress.setLastUpdatedTime(new Date());

        dao.insert(pointerAddress);

        PointerAddress pointerAddress1 = new PointerAddress();
        pointerAddress1.setLabels("测试Label");
        pointerAddress1.setId(pointerAddress.getId());
        pointerAddress1.setVersion(pointerAddress.getVersion());

        MvcResult result = mockMvc.perform(put("/api/pointerAddress/update/"+pointerAddress.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSONObject.toJSONString(pointerAddress1)).header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;
        PointerAddress cp =  jo.getObject("data" , PointerAddress.class);
        Assert.assertEquals( Integer.valueOf(2) , cp.getVersion());
        Assert.assertEquals( "测试Label" , cp.getLabels());
        Assert.assertEquals( pointerAddress.getAddress() , cp.getAddress());

    }


    @Test
    public void testDeletePointerAddress() throws Exception{
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
        pointerAddress.setLabels("商业中心");
        pointerAddress.setOrganizationId(TestTokenInterceptor.organizationId);
        pointerAddress.setCreatedTime(new Date());
        pointerAddress.setLastUpdatedTime(new Date());

        dao.insert(pointerAddress);


        MvcResult result = mockMvc.perform(delete("/api/pointerAddress/delete/"+pointerAddress.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .header("token" , token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        System.out.println(responseString);
        JSONObject jo =  JSONObject.parseObject(responseString);
        Assert.assertEquals(0 ,jo.getInteger("code").intValue()) ;

        PointerAddress dbp =  dao.selectById(pointerAddress.getId());
        Assert.assertEquals( PointerAddressService.STATUS_DELETE ,dbp.getState()) ;
    }
}
