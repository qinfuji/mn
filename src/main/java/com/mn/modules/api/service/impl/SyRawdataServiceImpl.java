package com.mn.modules.api.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.mn.common.utils.PageUtils;
import com.mn.common.utils.Query;

import com.mn.modules.api.dao.SyRawdataDao;
import com.mn.modules.api.entity.SyRawdataEntity;
import com.mn.modules.api.service.SyRawdataService;


@Service("syRawdataService")
public class SyRawdataServiceImpl extends ServiceImpl<SyRawdataDao, SyRawdataEntity> implements SyRawdataService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<SyRawdataEntity> page = this.selectPage(
                new Query<SyRawdataEntity>(params).getPage(),
                new EntityWrapper<SyRawdataEntity>()
        );

        return new PageUtils(page);
    }

}
