package com.mn.modules.api.controller;


import com.mn.common.utils.R;
import com.mn.modules.api.annotation.CheckToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/api")
public class TestController {


    @Autowired
    RestTemplate restTemplate;

    @CheckToken
    @GetMapping("/hello")
    public R hello(@RequestParam String name){
        return R.ok();
    }
}
