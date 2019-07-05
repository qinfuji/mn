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

import java.util.List;

@RestController
@RequestMapping("/api/categroylabels")
@Api("分类标签管理")
public class CategroyLabelController {
    private  static Logger logger = LoggerFactory.getLogger(CategroyLabelController.class);

    @Autowired
    CategroyLabelService categroyLabelService;

    @PostMapping("/create")
    @ApiOperation("创建分类标签")
    public RestResult<CategroyLabel> create(@RequestBody CategroyLabel categroyLabel) {
        try{
            ValidatorUtils.validateEntity(categroyLabel, AddGroup.class);
            categroyLabelService.save(categroyLabel);
            return RestResult.build(categroyLabel);
        }catch(Exception e){
            logger.error("创建分类标签失败" , e);
            return RestResult.fail.msg("创建分类标签失败");
        }

    }


    @PutMapping("/update/{id}")
    @ApiOperation("修改分类标签")
    public RestResult<CategroyLabel> update(@RequestBody CategroyLabel categroyLabel , @PathVariable Integer id) {
        try{
            CategroyLabel dbCategroyLabel = categroyLabelService.getById(id);
            if(dbCategroyLabel == null){
                 return RestResult.fail.msg("标签不存在");
            }
            ValidatorUtils.validateEntity(categroyLabel, UpdateGroup.class);
            categroyLabelService.updateById(categroyLabel);
            return RestResult.build(categroyLabel);
        }catch(Exception e){
            logger.error("修改分类标签失败" , e);
            return RestResult.fail.msg("修改分类标签失败");
        }

    }


    @GetMapping("/query")
    @ApiOperation("查询")
    public RestResult<CategroyLabel> query(@RequestParam String parentId) {
        try{
            List<CategroyLabel> ret;
            if(!"".equals(parentId) && parentId != null){
                QueryWrapper<CategroyLabel> qw = new QueryWrapper<>();
                qw.eq("parentId" , parentId);
                ret =  categroyLabelService.list(qw);
            }else{
                QueryWrapper<CategroyLabel> qw = new QueryWrapper<>();
                qw.isNull ("parentId");
                ret =  categroyLabelService.list(qw);
            }
            return RestResult.build(ret);
        }catch(Exception e){
            logger.error("查询分类标签失败" , e);
            return RestResult.fail.msg("查询分类标签失败");
        }
    }

    @GetMapping("/{id}/state/{value}")
    @ApiOperation("修改状态")
    public RestResult<CategroyLabel> updateState(@PathVariable Integer id , @PathVariable Integer value) {
        try{
            CategroyLabel categroyLabel = new CategroyLabel();
            categroyLabel.setId(id);
            categroyLabel.setState(value);
            categroyLabelService.updateById(categroyLabel);
            return RestResult.ok;
        }catch(Exception e){
            logger.error("修改状态失败" , e);
            return RestResult.fail.msg("修改状态失败");
        }

    }
}
