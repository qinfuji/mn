package com.mn.modules.api.remote.impl;

import com.mn.modules.api.remote.DataService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataServiceImpl implements DataService {
    @Override
    public List getFenceHotData(List fences) {
        return null;
    }

    @Override
    public List getFenceEstimateData(List fences) {
        return null;
    }
}
