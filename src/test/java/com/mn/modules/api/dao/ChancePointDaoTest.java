package com.mn.modules.api.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.jsonzou.jmockdata.JMockData;
import com.github.jsonzou.jmockdata.MockConfig;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.entity.ChancePoint;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;


public class ChancePointDaoTest extends BaseTest {

    @Autowired
    ChancePointDao dao;


    @Test
    public void testInsert(){
        ChancePoint cp =  getTempChancePoint();
        dao.insert(cp);
        assertNotEquals(null , cp.getId());
    }

    @Test
    public void testQuery(){
        for(int i=0 ; i<50; i++){
            ChancePoint cp = getTempChancePoint();
            dao.insert(cp);
        }

        Page<ChancePoint> page = new Page<>(1, 5);
        QueryWrapper<ChancePoint> queryWrapper = new QueryWrapper<>();
        IPage<ChancePoint> chancePointList = dao.selectPage(page , queryWrapper);

        assertEquals(chancePointList.getTotal() , 50);
        assertEquals(chancePointList.getRecords().size() , 5);
    }

    @Test
    public void testUpdate(){
        ChancePoint cp = getTempChancePoint();
        dao.insert(cp);

        String address = cp.getAddress();
        String city = cp.getCity();
        String id = cp.getId();

        ChancePoint updateCp = new ChancePoint();
        updateCp.setId(id);
        updateCp.setProvinceName("上海");
        dao.updateById(updateCp);
        ChancePoint rcp =  dao.selectById(cp.getId());
        assertEquals(rcp.getAddress() , address);
        assertEquals(rcp.getCity() , city);
        assertEquals(rcp.getProvinceName() , "上海");
    }
}
