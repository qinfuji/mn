package com.mn.modules.api.utils.melkman;


import java.util.*;

public class Melkman {


    public Polygon getConvexHullWithMelkman(List<Point> pointList) {
        if (pointList.size() < 3) {
            return null;
        }

        sortByAngle(pointList);

        Deque<Point> deque = new ArrayDeque<>();

        pointList.forEach(point -> {
            switch (deque.size()) {
                case 0:
                case 1:
                    deque.offerLast(point);
                    return;
                case 2:
                    deque.offerLast(point);
                    deque.offerFirst(point);
                    return;
                default:
                    Point lastRightVertex = deque.pollLast();
                    Point lastLeftVertex = deque.pollFirst();

                    if (this.isLeftTurn(deque.peekLast(), lastRightVertex, point)
                            && this.isLeftTurn(point, lastLeftVertex, deque.peekFirst())) {
                        return;
                    }

                    while (!this.isLeftTurn(deque.peekLast(), lastRightVertex, point)) {
                        lastRightVertex = deque.pollLast();
                    }
                    deque.offerLast(lastRightVertex);
                    deque.offerLast(point);

                    while (!this.isLeftTurn(point, lastLeftVertex, deque.peekFirst())) {
                        lastLeftVertex = deque.pollFirst();
                    }
                    deque.offerFirst(lastLeftVertex);
                    deque.offerFirst(point);
                    return;
            }
        });

        return new Polygon(new ArrayList<>(deque));
    }

    private void sortByAngle(List<Point> pointList) {
        Point minLngPoint = pointList.stream()
                .min(Comparator.comparing(Point::getLng)).get();
        pointList.remove(minLngPoint);

//        pointList.sort(new Comparator<Point>() {
//            @Override
//            public int compare(Point o1, Point o2) {
//                return Double.compare(angleWithSouth(minLngPoint, o1),
//                        angleWithSouth(minLngPoint, o2));
//            }
//        });

        pointList.sort(Comparator.comparingDouble(o -> angleWithSouth(minLngPoint, o)));
        pointList.add(0, minLngPoint);
    }

    public boolean isLeftTurn(Point point1, Point point2, Point point3) {
        return crossProduct(point1, point2, point3) > 0;
    }

    public double crossProduct(Point point1, Point point2, Point point3) {
        double x1 = point2.getLng() - point1.getLng();
        double y1 = point2.getLat() - point1.getLat();
        double x2 = point3.getLng() - point2.getLng();
        double y2 = point3.getLat() - point2.getLat();
        return x1 * y2 - x2 * y1;
    }

    public double dotProduct(Point point1, Point point2, Point point3) {
        double x1 = point2.getLng() - point1.getLng();
        double y1 = point2.getLat() - point1.getLat();
        double x2 = point3.getLng() - point2.getLng();
        double y2 = point3.getLat() - point2.getLat();
        return x1 * x2 + y1 * y2;
    }

    public double angleWithSouth(Point point1, Point point2) {
        Point point = new Point(point1.getLng(), point1.getLat() + 1);
        return Math.acos(this.dotProduct(point, point1, point2)
                / (this.norm(point, point1) * this.norm(point1, point2)));
    }

    public double norm(Point point1, Point point2) {
        double deltaLat = point2.getLat() - point1.getLat();
        double deltaLng = point2.getLng() - point1.getLng();

        return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
    }

}
