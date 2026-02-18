# web_demo 使用说明

这是一个纯静态 HTML 演示，用来证明 content/data 文件能直接驱动页面。

## 运行方式（任选其一）

1）用任何静态服务器：
   - Python: `python -m http.server 8000`（在打包目录根运行）
   - 然后打开 `http://localhost:8000/web_demo/`

2）直接用 VS Code 的 Live Server。

注意：直接双击打开 HTML 可能因浏览器 CORS 无法读取 ../data 下的文件。
