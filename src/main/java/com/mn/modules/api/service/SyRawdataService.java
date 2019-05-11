package com.mn.modules.api.service;

import com.baomidou.mybatisplus.service.IService;
import com.mn.common.utils.PageUtils;
import com.mn.modules.api.entity.SyRawdataEntity;

import java.util.Map;

/**
 * 
 *
 * @author duxb
 * @email duxb@mippoint.com
 * @date 2019-04-09 13:25:28
 */
public interface SyRawdataService extends IService<SyRawdataEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

