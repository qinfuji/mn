package com.mn.modules.api.utils;

import java.awt.geom.Point2D;
import java.util.List;

/**
 * 判断一个点是否在一个多边形内
 * 提供了三种计算方式，孰好孰坏在实践中比较一下
 * @author xiongshiyan at 2019/1/11 , contact me with email yanshixiong@126.com or phone 15208384257
 */
public class GeometryUtil {
    private static final int POLYGON_MIN_SIZE = 3;

    public static boolean isPtInPolygon (Point2D.Double point , List<Point2D.Double> polygon) {
        assertParams(point, polygon);

        int iSum,iIndex;
        double dLon1 , dLon2 , dLat1 , dLat2 , dLon;
        int size = polygon.size();
        iSum = 0;
        for (iIndex = 0; iIndex<size; iIndex++) {
            if (iIndex == size - 1) {
                dLon1 = polygon.get(iIndex).getX();
                dLat1 = polygon.get(iIndex).getY();
                dLon2 = polygon.get(0).getX();
                dLat2 = polygon.get(0).getY();
            } else {
                dLon1 = polygon.get(iIndex).getX();
                dLat1 = polygon.get(iIndex).getY();
                dLon2 = polygon.get(iIndex + 1).getX();
                dLat2 = polygon.get(iIndex + 1).getY();
            }
            // 以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
            if (((point.y >= dLat1) && (point.y < dLat2))
                    || ((point.y >= dLat2) && (point.y < dLat1))) {
                if (Math.abs(dLat1 - dLat2) > 0) {
                    //得到 A点向左射线与边的交点的x坐标：
                    dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - point.y) ) / (dLat1 - dLat2);
                    // 如果交点在A点左侧（说明是做射线与 边的交点），则射线与边的全部交点数加一：
                    if (dLon < point.x) {
                        iSum++;
                    }
                }
            }
        }
        return (iSum % 2) != 0;
    }

    /**
     * 返回一个点是否在一个多边形区域内， 如果点位于多边形的顶点或边上，不算做点在多边形内，返回false
     */
    public static boolean isPointInPoly(Point2D.Double point, List<Point2D.Double> polygon) {
        assertParams(point, polygon);

        java.awt.geom.GeneralPath p = new java.awt.geom.GeneralPath();
        Point2D.Double first = polygon.get(0);
        p.moveTo(first.x, first.y);
        int size = polygon.size();
        for (int i = 1; i < size; i++) {
            Point2D.Double pa = polygon.get(i);
            p.lineTo(pa.x, pa.y);
        }
        p.lineTo(first.x, first.y);
        p.closePath();
        return p.contains(point);
    }

    /**
     * 判断点是否在多边形内，如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
     * @param point 检测点
     * @param polygon   多边形的顶点
     * @return      点在多边形内返回true,否则返回false
     */
    public static boolean isPtInPoly(Point2D.Double point, List<Point2D.Double> polygon){
        assertParams(point, polygon);

        int N = polygon.size();
        //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        boolean boundOrVertex = true;
        //cross points count of x
        int intersectCount = 0;
        //浮点类型计算时候与0比较时候的容差
        double precision = 2e-10;
        //neighbour bound vertices
        Point2D.Double p1, p2;
        //当前点
        Point2D.Double p = point;

        //left vertex
        p1 = polygon.get(0);
        //check all rays
        for(int i = 1; i <= N; ++i){
            if(p.equals(p1)){
                //p is an vertex
                return boundOrVertex;
            }

            //right vertex
            p2 = polygon.get(i % N);
            //ray is outside of our interests
            if(p.x < Math.min(p1.x, p2.x) || p.x > Math.max(p1.x, p2.x)){
                p1 = p2;
                //next ray left point
                continue;
            }

            //ray is crossing over by the algorithm (common part of)
            if(p.x > Math.min(p1.x, p2.x) && p.x < Math.max(p1.x, p2.x)){
                //x is before of ray
                if(p.y <= Math.max(p1.y, p2.y)){
                    //overlies on a horizontal ray
                    if(p1.x == p2.x && p.y >= Math.min(p1.y, p2.y)){
                        return boundOrVertex;
                    }

                    //ray is vertical
                    if(p1.y == p2.y){
                        //overlies on a vertical ray
                        if(p1.y == p.y){
                            return boundOrVertex;
                            //before ray
                        }else{
                            ++intersectCount;
                        }
                        //cross point on the left side
                    }else{
                        //cross point of y
                        double xinters = (p.x - p1.x) * (p2.y - p1.y) / (p2.x - p1.x) + p1.y;
                        //overlies on a ray
                        if(Math.abs(p.y - xinters) < precision){
                            return boundOrVertex;
                        }

                        //before ray
                        if(p.y < xinters){
                            ++intersectCount;
                        }
                    }
                }
                //special case when ray is crossing through the vertex
            }else{
                //p crossing over p2
                if(p.x == p2.x && p.y <= p2.y){
                    //next vertex
                    Point2D.Double p3 = polygon.get((i+1) % N);
                    //p.x lies between p1.x & p3.x
                    if(p.x >= Math.min(p1.x, p3.x) && p.x <= Math.max(p1.x, p3.x)){
                        ++intersectCount;
                    }else{
                        intersectCount += 2;
                    }
                }
            }
            //next ray left point
            p1 = p2;
        }

        //偶数在多边形外
        if(intersectCount % 2 == 0){
            return false;
            //奇数在多边形内
        } else {
            return true;
        }
    }
    private static void assertParams(Point2D.Double point, List<Point2D.Double> polygon) {
        if(null == point || null == polygon || polygon.size() < POLYGON_MIN_SIZE) {
            throw new IllegalArgumentException("参数不能为空，且多边形点数大于3");
        }
    }
}