package com.mn.modules.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.mn.common.validator.ValidatorUtils;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.entity.CategroyLabel;
import com.mn.modules.api.service.CategroyLabelService;
import com.mn.modules.api.vo.RestResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.util.List;

@RestController
@RequestMapping("/api/categroylabels")
@Api("分类标签管理")
public class CategroyLabelController {
    private  static Logger logger = LoggerFactory.getLogger(CategroyLabelController.class);

    @Autowired
    CategroyLabelService categroyLabelService;


    @PostMapping("/createOrUpdate")
    @ApiOperation("创建分类标签")
    public RestResult<CategroyLabel> createOrUpdate(@RequestBody CategroyLabel categroyLabel) {
        try{
            ValidatorUtils.validateEntity(categroyLabel, AddGroup.class);
            categroyLabel.setState(CategroyLabelService.STATE_NORMAL);
            categroyLabelService.saveOrUpdate(categroyLabel);
            return RestResult.build(categroyLabel);
        }catch(Exception e){
            logger.error("创建分类标签失败" , e);
            return RestResult.fail.msg("创建分类标签失败");
        }

    }


    @GetMapping("/query")
    @ApiOperation("查询")
    public RestResult<CategroyLabel> query(@RequestParam(required = false) String parentId) {
        try{
            List<CategroyLabel> ret;
            QueryWrapper<CategroyLabel> qw = new QueryWrapper<>();
            qw.ne("state" , CategroyLabelService.STATE_INVALID);
            if(!"".equals(parentId) && parentId != null){
                qw.eq("parent_id" , parentId);
                ret =  categroyLabelService.list(qw);
            }else{
                qw.isNull ("parent_id");
                ret =  categroyLabelService.list(qw);
            }
            return RestResult.build(ret);
        }catch(Exception e){
            logger.error("查询分类标签失败" , e);
            return RestResult.fail.msg("查询分类标签失败");
        }
    }

    @GetMapping("/queryRootByLabel")
    @ApiOperation("查询根标签名称")
    public RestResult<CategroyLabel> queryRootByLabel(@RequestParam String rootLabel) {
        try{
            List<CategroyLabel> ret;
            QueryWrapper<CategroyLabel> qw = new QueryWrapper<>();
            qw.ne("state" , CategroyLabelService.STATE_INVALID);
            qw.isNull ("parent_id");
            qw.like("label" , rootLabel);
            ret =  categroyLabelService.list(qw);
            return RestResult.build(ret);
        }catch(Exception e){
            logger.error("查询分类标签失败" , e);
            return RestResult.fail.msg("查询分类标签失败");
        }
    }

    @PutMapping("/{id}/state")
    @ApiOperation("失效")
    public RestResult<CategroyLabel> invalid(@PathVariable Integer id) {
        try{
            CategroyLabel categroyLabel = new CategroyLabel();
            categroyLabel.setId(id);
            categroyLabel.setState(CategroyLabelService.STATE_INVALID);
            categroyLabelService.updateById(categroyLabel);
            return RestResult.ok;
        }catch(Exception e){
            logger.error("修改状态失败" , e);
            return RestResult.fail.msg("修改状态失败");
        }

    }

    @GetMapping("/queryAll")
    @ApiOperation("查询所有")
    public RestResult<List<CategroyLabel>> queryAll() {
        try{
            QueryWrapper<CategroyLabel> qw =  new QueryWrapper<>();
            qw.eq("state" , CategroyLabelService.STATE_NORMAL);
            List<CategroyLabel>  l  = categroyLabelService.list(qw);
            return RestResult.build(l);
        }catch(Exception e){
            logger.error("查询所有分类标签失败" , e);
            return RestResult.fail.msg("查询所有分类标签失败");
        }

    }
}
