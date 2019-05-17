package com.mn.modules.api;

import com.github.jsonzou.jmockdata.JMockData;
import com.github.jsonzou.jmockdata.MockConfig;
import com.mn.MNBIApplication;
import com.mn.modules.api.entity.ChancePoint;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@ActiveProfiles({"test"})
@ExtendWith(SpringExtension.class)
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MNBIApplication.class)
@Transactional
public class BaseTest {

    protected final MockConfig CHANCE_MOCK_CONFIG = new MockConfig()
            .globalConfig().excludes("id");



    public ChancePoint getTempChancePoint(){
        ChancePoint cp = new ChancePoint();
        return JMockData.mock(ChancePoint.class, CHANCE_MOCK_CONFIG);
    }
}
