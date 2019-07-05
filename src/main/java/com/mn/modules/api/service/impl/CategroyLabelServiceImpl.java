package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mn.modules.api.dao.CategroyLabelDao;
import com.mn.modules.api.entity.CategroyLabel;
import com.mn.modules.api.service.CategroyLabelService;
import org.springframework.stereotype.Service;

@Service
public class CategroyLabelServiceImpl extends ServiceImpl<CategroyLabelDao , CategroyLabel> implements CategroyLabelService {
}
