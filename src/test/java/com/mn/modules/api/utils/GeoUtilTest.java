package com.mn.modules.api.utils;

import org.junit.Assert;
import org.junit.Test;

import java.awt.geom.Point2D;
import java.util.Arrays;
import java.util.List;

public class GeoUtilTest {
    @Test
    public void testPointInPoly(){
        List<LngLat> points =
                Arrays.asList(
                        new LngLat(116.169465d,39.932670d),
                        new LngLat(116.160260,39.924492),
                        new LngLat(116.186138,39.879817),
                        new LngLat(116.150625,39.710019),
                        new LngLat(116.183198,39.709920),
                        new LngLat(116.226950,39.777616),
                        new LngLat(116.421078,39.810771),
                        new LngLat(116.442621,39.799892),
                        new LngLat(116.463478,39.790066),
                        new LngLat(116.588276,39.809551),
                        new LngLat(116.536091,39.808859),
                        new LngLat(116.573856,39.839643),
                        new LngLat(116.706380,39.916740),
                        new LngLat(116.657285,39.934545),
                        new LngLat(116.600293,39.937770),
                        new LngLat(116.540039,39.937968),
                        new LngLat(116.514805,39.982375),
                        new LngLat(116.499935,40.013710),
                        new LngLat(116.546520,40.030443),
                        new LngLat(116.687668,40.129961),
                        new LngLat(116.539697,40.080659),
                        new LngLat(116.503390,40.058474),
                        new LngLat(116.468800,40.052578));

        LngLat pointNot = new LngLat(116.566298, 40.014179);
        LngLat pointYes = new LngLat(116.529906,39.904706);
        LngLat pointYes2 = new LngLat(116.367171,39.968411);

        Assert.assertFalse(GeometryUtil.isPtInPoly(pointNot, points));
        Assert.assertTrue(GeometryUtil.isPtInPoly(pointYes, points));
        Assert.assertTrue(GeometryUtil.isPtInPoly(pointYes2, points));

        Assert.assertFalse(GeometryUtil.isPointInPoly(pointNot, points));
        Assert.assertTrue(GeometryUtil.isPointInPoly(pointYes, points));
        Assert.assertTrue(GeometryUtil.isPointInPoly(pointYes2, points));

        Assert.assertFalse(GeometryUtil.isPtInPolygon(pointNot, points));

        Assert.assertTrue(GeometryUtil.isPtInPolygon(pointYes, points));
        Assert.assertTrue(GeometryUtil.isPtInPolygon(pointYes2, points));
    }
}
