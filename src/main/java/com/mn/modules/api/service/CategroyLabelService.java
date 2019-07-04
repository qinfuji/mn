package com.mn.modules.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.mn.modules.api.entity.CategroyLabel;

public interface CategroyLabelService extends IService<CategroyLabel> {

    Integer STATE_INVALID = 0;
    Integer STATE_NORMAL = 1;
}
