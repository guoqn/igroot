const path = require('path');

const homeTmpl = './template/Home/index';
const contentTmpl = './template/Content/index';
const compsContentTmpl = './template/compContent/index';
const bcompsContentTmpl = './template/bcompContent/index';

function pickerGenerator(module) {
  const tester = new RegExp(`^docs/${module}`);
  return (markdownData) => {
    const { filename } = markdownData.meta;
    if (tester.test(filename) &&
      !/\/demo$/.test(path.dirname(filename))) {
      return {
        meta: markdownData.meta,
      };
    }
  };
}

module.exports = {
  lazyLoad(nodePath, nodeValue) {
    if (typeof nodeValue === 'string') {
      return true;
    }
    return nodePath.endsWith('/demo');
  },
  pick: {
    components(markdownData) {
      const { filename } = markdownData.meta;
      if (!/^components/.test(filename) ||
        /[/\\]demo$/.test(path.dirname(filename))) return;

      return {
        meta: markdownData.meta,
      };
    },
    bcomponents(markdownData) {
      const { filename } = markdownData.meta;
      if (!/^bcomponents/.test(filename) ||
        /[/\\]demo$/.test(path.dirname(filename))) return;

      return {
        meta: markdownData.meta,
      };
    },
    changelog(markdownData) {
      if (/CHANGELOG/.test(markdownData.meta.filename)) {
        return {
          meta: markdownData.meta,
        };
      }
    },
    'docs/pattern': pickerGenerator('pattern'),
    'docs/react': pickerGenerator('react'),
    // 'docs/resource': pickerGenerator('resource'),
    'docs/spec': pickerGenerator('spec'),
    'docs/theme': pickerGenerator('theme'),
    'docs/icon': pickerGenerator('icon'),
    'docs/start': pickerGenerator('start'),
    'docs/business': pickerGenerator('business'),
  },
  plugins: [
    'bisheng-plugin-description',
    'bisheng-plugin-toc?maxDepth=2&keepElem',
    'bisheng-plugin-antd',
    'bisheng-plugin-react?lang=__react',
  ],
  routes: {
    path: '/',
    component: './template/Layout/index',
    indexRoute: { component: homeTmpl },
    childRoutes: [{
      path: 'index-cn',
      component: homeTmpl,
    }, {
      path: 'docs/pattern/:children',
      component: contentTmpl,
    }, {
      path: 'docs/react/:children',
      component: compsContentTmpl,
    }, {
      path: 'changelog',
      component: contentTmpl,
    }, {
      path: 'changelog-cn',
      component: contentTmpl,
    }, {
      path: 'components/:children/',
      component: compsContentTmpl,
    }, {
      path: 'docs/spec/:children',
      component: contentTmpl,
    }, {
      path: 'docs/resource/:children',
      component: contentTmpl,
    }, {
      path: 'docs/icon/:children',
      component: contentTmpl,
    }, {
      path: 'docs/theme/:children',
      component: contentTmpl,
    }, {
      path: 'docs/start/:children',
      component: contentTmpl,
    }, {
      path: 'docs/business/:children',
      component: bcompsContentTmpl,
    }, {
      path: 'bcomponents/:children/',
      component: bcompsContentTmpl,
    }],
  },
};
