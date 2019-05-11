//package com.mn;
//
//import com.power.doc.builder.ApiDocBuilder;
//import com.power.doc.model.*;
//import org.junit.Test;
//
//import java.util.ArrayList;
//import java.util.List;
//
///**
// * @author duxb
// * @date 2019/4/18 18:28
// * @desc ApiDoc测试
// */
//
//public class ApiDocTest {
//    /**
//     * 简单型接口，不需要指定请求头，并且项目是maven的.
//     *
//     */
//    @Test
//    public void testBuilderControllersApiSimple(){
//        //将生成的文档输出到d:\md目录下，严格模式下api-doc会检测Controller的接口注释
//        ApiDocBuilder.builderControllersApi("d:\\md",true);
//    }
//
//    /**
//     * 包括设置请求头，缺失注释的字段批量在文档生成期使用定义好的注释
//     */
//    @Test
//    public void testBuilderControllersApi() {
//        ApiConfig config = new ApiConfig();
//        //config.setStrict(true);
//        config.setAllInOne(true);//true则将所有接口合并到一个AllInOne中markdown中，错误码合并到最后
//        config.setOutPath("d:\\md");
//        // @since 1.2,如果不配置该选项，则默认匹配全部的controller,
//        // 如果需要配置有多个controller可以使用逗号隔开
//        //config.setPackageFilters("com.power.doc.controller.app");
//        //默认是src/main/java,maven项目可以不写
////        config.setSourcePaths(
////                SourcePath.path().setDesc("本项目代码").setPath("src/test/java"),
////                SourcePath.path().setPath("E:\\Test\\Mybatis-PageHelper-master\\src\\main\\java"),
////                SourcePath.path().setDesc("加载项目外代码").setPath("E:\\ApplicationPower\\ApplicationPower\\Common-util\\src\\main\\java")
////        );
//
//        //设置请求头，如果没有请求头，可以不用设置
//        config.setRequestHeaders(
//                ApiReqHeader.header().setName("token").setType("string").setDesc("token")
//        );
//
//        ApiDocBuilder.builderControllersApi(config);
//    }
//}
