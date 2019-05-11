/*****************
作者：杜晓波
时间：2015年11月4日
备注：该文件为核心文件，可以按照喜好自行修改
******************/



//分页插件
(function ($) {
    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //首页、上一页

                //obj.append('<a href="javascript:;" class="firstp firstPage"></a>');
                //obj.append('<a href="javascript:;" class="prevPage"></a>');
                if (args.current > 1) {
                    obj.append('<a href="javascript:;" class="first btn btn-default">首页</a>');
                    obj.append('<a href="javascript:;" class="previous btn btn-default">上一页</a>');

                } else {
                    //obj.remove('.firstp');
                    obj.append('<span class=" disabled btn btn-default">首页</span>');
                    //obj.remove('.prevPage');
                    obj.append('<span class=" disabled btn btn-default">上一页</span>');

                }

               

                //中间页码
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="pagenum btn btn-default">' + 1 + '</a>');
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<a href="javascript:;" class="pagenum btn btn-default ">' + start + '</a>');
                        } else {
                            obj.append('<span class="  pagecurrent btn btn-link">' + start + '</span>');
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="pagenum btn btn-default ">' + args.pageCount + '</a>');
                }
               

                //尾页、下一页
                //obj.append('<a href="javascript:;" class="nextPage"></a>');
                //obj.append('<a href="javascript:;" class="lastp endPage"></a>');
                if (args.current < args.pageCount) {
                    obj.append('<a href="javascript:;" class="nextPage next btn btn-default">下一页</a>');
                    obj.append('<a href="javascript:;" class="lastp last btn btn-default">尾页</a>');
                } else {
                   
                    obj.append('<span class="next btn btn-default disabled">下一页</span>');
                   
                    obj.append('<span class="lastp last btn btn-default disabled">尾页</span>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {
            return (function () {
                obj.unbind();
                obj.on("click", "a.pagenum", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, { "current": current, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current);
                    }
                   // alert("数字");
                });
                //上一页
                obj.on("click", "a.previous", function () {
                    var current = parseInt(obj.children("span.pagecurrent").text());
                    //smq 判断当前页是否为第一页 如为第一页 首页不可用
                   // var current = parseInt(obj.children("span.current").text());
                    if (current == 1)
                    {
                        return;
                    }
                    ms.fillHtml(obj, { "current": current - 1, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                   // alert("上一页");
                });


                //首页
                obj.on("click", "a.first", function () {

                    
                    ms.fillHtml(obj, { "current": 1, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(1);
                    }
                    //alert("首页");
                });

                //尾页
                obj.on("click", "a.lastp", function () {

                    ms.fillHtml(obj, { "current": args.pageCount, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(args.pageCount);
                    }
                    //alert("尾页");
                });


                //下一页
                obj.on("click", "a.nextPage", function () {
                    var current = parseInt(obj.children("span.pagecurrent").text());
                    var allcount = parseInt(args.pageCount);
                    if (current == allcount)
                    {
                        return;
                    }
                        ms.fillHtml(obj, { "current": current + 1, "pageCount": args.pageCount });
                        if (typeof (args.backFn) == "function") {
                            args.backFn(current + 1);
                        }
                   
                    //alert("下一页");
                });
            })();
        }
    }
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () { }
        }, options);
        ms.init(this, args);
    }
})(jQuery);

