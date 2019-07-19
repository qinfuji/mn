package com.mn.modules.api.utils;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

/**
 * 判断一个点是否在一个多边形内
 * 提供了三种计算方式，孰好孰坏在实践中比较一下
 *
 * @author xiongshiyan at 2019/1/11 , contact me with email yanshixiong@126.com or phone 15208384257
 */
public class GeometryUtil {
    private static final int POLYGON_MIN_SIZE = 3;

    /**
     * @param point
     * @param polygon 多边形的顶点
     * @return
     */
    public static boolean isPtInPolygon(LngLat point, List<LngLat> polygon) {

        assertParams(point, polygon);
        int iSum, iIndex;
        double dLon1, dLon2, dLat1, dLat2, dLon;
        int size = polygon.size();
        iSum = 0;
        for (iIndex = 0; iIndex < size; iIndex++) {
            if (iIndex == size - 1) {
                dLon1 = polygon.get(iIndex).getLng();
                dLat1 = polygon.get(iIndex).getLat();
                dLon2 = polygon.get(0).getLng();
                dLat2 = polygon.get(0).getLat();
            } else {
                dLon1 = polygon.get(iIndex).getLng();
                dLat1 = polygon.get(iIndex).getLat();
                dLon2 = polygon.get(iIndex + 1).getLng();
                dLat2 = polygon.get(iIndex + 1).getLat();
            }
            // 以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
            Double pointLng = point.getLng();
            Double pointLat = point.getLat();

            if (((pointLat >= dLat1) && (pointLat < dLat2))
                    || ((pointLat >= dLat2) && (pointLat < dLat1))) {
                if (Math.abs(dLat1 - dLat2) > 0) {
                    //得到 A点向左射线与边的交点的x坐标：
                    dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - pointLat)) / (dLat1 - dLat2);
                    // 如果交点在A点左侧（说明是做射线与 边的交点），则射线与边的全部交点数加一：
                    if (dLon < pointLng) {
                        iSum++;
                    }
                }
            }
        }
        return (iSum % 2) != 0;
    }

    /**
     * @param point   检测点
     * @param polygon 多边形的顶点
     *                返回一个点是否在一个多边形区域内， 如果点位于多边形的顶点或边上，不算做点在多边形内，返回false
     */
    public static boolean isPointInPoly(LngLat point, List<LngLat> polygon) {
        assertParams(point, polygon);
        java.awt.geom.GeneralPath p = new java.awt.geom.GeneralPath();
        LngLat first = polygon.get(0);
        p.moveTo(first.getLng(), first.getLat());
        int size = polygon.size();
        for (int i = 1; i < size; i++) {
            LngLat pa = polygon.get(i);
            p.lineTo(pa.getLng(), pa.getLat());
        }
        p.lineTo(first.getLng(), first.getLat());
        p.closePath();
        return p.contains(point.getLng(), point.getLat());
    }

    /**
     * 判断点是否在多边形内，如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
     *
     * @param point   检测点
     * @param polygon 多边形的顶点
     * @return 点在多边形内返回true, 否则返回false
     */
    public static boolean isPtInPoly(LngLat point, List<LngLat> polygon) {
        assertParams(point, polygon);

        int N = polygon.size();
        //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        boolean boundOrVertex = true;
        //cross points count of x
        int intersectCount = 0;
        //浮点类型计算时候与0比较时候的容差
        double precision = 2e-10;
        //neighbour bound vertices
        LngLat p1, p2;
        //当前点
        LngLat p = point;

        //left vertex
        p1 = polygon.get(0);
        //check all rays
        for (int i = 1; i <= N; ++i) {
            if (p.equals(p1)) {
                //p is an vertex
                return boundOrVertex;
            }
            //right vertex
            p2 = polygon.get(i % N);
            //ray is outside of our interests
            if (p.getLng() < Math.min(p1.getLng(), p2.getLng()) || p.getLng() > Math.max(p1.getLng(), p2.getLng())) {
                p1 = p2;
                //next ray left point
                continue;
            }

            //ray is crossing over by the algorithm (common part of)
            if (p.getLng() > Math.min(p1.getLng(), p2.getLng()) && p.getLng() < Math.max(p1.getLng(), p2.getLng())) {
                //x is before of ray
                if (p.getLat() <= Math.max(p1.getLat(), p2.getLat())) {
                    //overlies on a horizontal ray
                    if (p1.getLng().equals(p2.getLng()) && p.getLat() >= Math.min(p1.getLat(), p2.getLat())) {
                        return boundOrVertex;
                    }

                    //ray is vertical
                    if (p1.getLat().equals(p2.getLat())) {
                        //overlies on a vertical ray
                        if (p1.getLat().equals(p.getLat())) {
                            return boundOrVertex;
                            //before ray
                        } else {
                            ++intersectCount;
                        }
                        //cross point on the left side
                    } else {
                        //cross point of y
                        double xinters = (p.getLng() - p1.getLng()) * (p2.getLat() - p1.getLat()) / (p2.getLng() - p1.getLng()) + p1.getLat();
                        //overlies on a ray
                        if (Math.abs(p.getLat() - xinters) < precision) {
                            return boundOrVertex;
                        }
                        //before ray
                        if (p.getLat() < xinters) {
                            ++intersectCount;
                        }
                    }
                }
                //special case when ray is crossing through the vertex
            } else {
                //p crossing over p2
                if (p.getLng().equals(p2.getLng()) && p.getLat() <= p2.getLat()) {
                    //next vertex
                    LngLat p3 = polygon.get((i + 1) % N);
                    //p.x lies between p1.x & p3.x
                    if (p.getLng() >= Math.min(p1.getLng(), p3.getLng()) && p.getLng() <= Math.max(p1.getLng(), p3.getLng())) {
                        ++intersectCount;
                    } else {
                        intersectCount += 2;
                    }
                }
            }
            //next ray left point
            p1 = p2;
        }

        //偶数在多边形外
        if (intersectCount % 2 == 0) {
            return false;
            //奇数在多边形内
        } else {
            return true;
        }
    }

    private static void assertParams(LngLat point, List<LngLat> polygon) {
        if (null == point || null == polygon || polygon.size() < POLYGON_MIN_SIZE) {
            throw new IllegalArgumentException("参数不能为空，且多边形点数大于3");
        }
    }

    /**
     * 获取多边形的中心
     * @param points
     * @return
     */
    public static LngLat getCenterOfGravityPoint(List<LngLat> points ) {
        double area = 0.0;//多边形面积
        double Gx = 0.0, Gy = 0.0;// 重心的x、y
        for (int i = 1; i <= points.size(); i++) {
            double iLat = points.get(i % points.size()).getLat();
            double iLng = points.get(i % points.size()).getLng();
            double nextLat = points.get(i - 1).getLat();
            double nextLng = points.get(i - 1).getLng();
            double temp = (iLat * nextLng - iLng * nextLat) / 2.0;
            area += temp;
            Gx += temp * (iLng + nextLng) / 3.0;
            Gy += temp * (iLat + nextLat) / 3.0;
        }
        Gx = Gx / area;
        Gy = Gy / area;
        LngLat lnglat = new LngLat();
        lnglat.setLng(Gx);
        lnglat.setLat(Gy);
        return lnglat;
    }

}