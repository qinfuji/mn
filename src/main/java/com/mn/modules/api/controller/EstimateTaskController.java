package com.mn.modules.api.controller;


import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estimateTask")
@Api("点址评估任务管理")
public class EstimateTaskController {
    private  static Logger logger = LoggerFactory.getLogger(EstimateTaskController.class);
}
