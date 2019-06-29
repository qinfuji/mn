module.exports = {
  'POST /api/courses/list': (req, res) => {
    res.send(genData(req.body.pageIndex));
  },
};
