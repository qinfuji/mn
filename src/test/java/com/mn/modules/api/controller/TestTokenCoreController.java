package com.mn.modules.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.utils.Tools;
import org.junit.Assert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class TestTokenCoreController extends BaseTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @BeforeEach // 在测试开始前初始化工作
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void testGetToken() {
        try {
            String appId = "hcr000001";
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

            String responseString = result.getResponse().getContentAsString();
            JSONObject json = JSONObject.parseObject(responseString);
            Assert.assertEquals(json.getInteger("code").intValue(), 0);
            Assert.assertNotEquals(json.getString("token"), null);

        } catch (Exception error) {
            error.printStackTrace();
        }
    }
}
