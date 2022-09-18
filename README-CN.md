<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/cube-logo-dark.png">
    <img height="40" src="./assets/cube-logo-light.png">
  </picture>
  <br>
  <a href="./README.md">English</a>
  |
  <span>简体中文</span>
  <img src="./assets/ipad.png" style="max-width: 90%" />
  <h4>基于 Nest.js 的服务端渲染 GitHub 贡献墙</h4>
  <p style="color: grey;font-size: 0.9rem">
  只需要在路由 <code>参数</code> 中传入 GitHub 用户名，就可以渲染出 GitHub 贡献墙，支持自定义
  <b>输出格式</b>,
  <b>主题颜色</b>,
  <b>导出图像的质量</b>, 
  <b>统计天数</b>
  等等
  </p>
  <br />
  <span>实时渲染示例：</span>
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?format=svg&weeks=50&dark=true">
    <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?format=svg&weeks=50">
    <img alt="" src="https://ssr-contributions-svg.vercel.app/_/CatsJuice?format=svg&weeks=50" max-height="150">
  </picture>
</div>

## 在线预览与配置

现在你可以通过 [Playground](https://ssr-contributions-svg.vercel.app/) 在线预览与配置。

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/anim/playground-zh-dark.gif">
    <img src="./assets/anim/playground-zh-light.gif">
  </picture>
</div>


## 实现原理

- 在 [Medium](https://medium.com/@catsjuice/fake-3d-bar-chart-with-svg-js-134684bd5100) 上查看实现原理。
- 在 [Codepen](https://codepen.io/catsjuice/pen/MWVqNdQ) 上查看最小实现。


## 本地运行

- **为 GitHub OpenAPI 准备 PAT:**
  > https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

- **在根目录下创建 `.env` 文件， 并参考 `.env.example` 填写**

- **使用以下命令安装依赖:**
  ```shell
  # npm install
  yarn install
  ```
- **运行服务:**
  ```shell
  # npm run start:dev
  yarn start:dev
  ```
- **在浏览器中查看效果**
  访问 `http://localhost:${port}/_/${username}`, 
  - `port`: `.env` 文件中的`SERVE_PORT` 变量 , 默认为 `3000`
  - `username`: Github 用户名

## 配置

```
${host}/_/${username}?${queryString}
```

- `username`: Github 用户名
- `queryString`

**公共请求参数:**

<table>
  <tr>
    <th>参数名</th>
    <th>类型</th>
    <th>描述</th>
    <th>默认值</th>
  </tr>

  <tr>
    <td>theme</td>
    <td><code>enum</code></td>
    <td>
      内置主题，可用值：
      <code>random</code>（使用随机主题）
      或
      <a href="#主题">主题枚举值</a>
    </td>
    <td><code>green</code></td>
  </tr>

  <tr>
    <td>chart</td>
    <td><code>enum</code></td>
    <td>
      图表类型, 可用图表见：
      <a href="#图表">图表</a>
    </td>
    <td><code>calendar</code></td>
  </tr>

  <tr>
    <td>format</td>
    <td><code>enum</code></td>
    <td>
      输出格式:
      <ul>
        <li>
          <code>html</code>
          <span>: 直接返回一个 html 页面</span>
        </li>
        <li>
          <code>svg</code>
          <span>: 返回 svg 文件</span>
        </li>
        <li>
          <code>xml</code>
          <span>: 返回 xml 格式的svg</span>
        </li>
        <li>
          <code>png</code>
          <span>: 返回 png 格式的文件(透明背景)</span>
        </li>
        <li>
          <code>jpeg</code>
          <span>: 返回 jpeg 格式的文件(白色背景)</span>
        </li>
      </ul>
    </td>
    <td><code>html</code></td>
  </tr>

  <tr>
    <td>quality</td>
    <td><code>number</code></td>
    <td>
      图像质量，取值范围为 <code>0.1</code> 到 <code>10</code>.
      <b>
        仅当导出格式（<code>format</code>）为
        <code>png</code> or <code>jpeg</code>
        时有效
      <b>
    </td>
    <td><code>1</code></td>
  </tr>

  <tr>
    <td>widget_size</td>
    <td><code>enum</code></td>
    <td>
     通过指定这一属性，自动计算周的数量 和 最佳的 ios 小组件，可用值为：
      <ul>
        <li><code>small</code></li>
        <li><code>medium</code></li>
        <li><code>large</code></li>
      </ul>
    </td>
    <td><code>medium</code></td>
  </tr>

  <tr>
    <td>weeks</td>
    <td><code>number</code></td>
    <td>
      强制指定周数，取值范围在
      <code>1</code> 到 <code>50</code>.
      <b>会覆盖 <code>widget_size</code> 计算的 <code>周数</code> </b>
    </td>
    <td><code>undefined</code></td>
  </tr>

  <tr>
    <td>colors</td>
    <td><code>string | string[]</code></td>
    <td>
      通过 <code>,</code> 拼接Hex 格式的颜色值 (需要去除 <code>#</code> 前缀) 
      <br />
      <span>或者使用多个 <code>colors</code>变量</span>
      <br />
      <span>例如：</span>
      <br />
      <ul>
        <li>
          <span><code>colors=f00,0f0,00f,0ff,f0f,ff0</code></span>
        </li>
        <li>
          <span>
          <code>colors=f00&colors=0f0</code>
          </span>
        </li>
      </ul>
      <b>
        这将会覆盖
        <code>theme</code> 属性
      </b>
    </td>
    <td><code>undefined</code></td>
  </tr>

  <tr>
    <td>dark</td>
    <td><code>boolean</code></td>
    <td>
      启用 “暗黑模式”，详见
      <a href="#暗黑模式">暗黑模式</a>
    </td>
    <td>
      <code>false</code>
    </td>
  </tr>

</table>

**3D柱状图参数:**

<table>
  <tr>
    <th>参数名</th>
    <th>类型</th>
    <th>描述</th>
    <th>默认值</th>
  </tr>

  <tr>
    <td>gap</td>
    <td><code>number</code></td>
    <td>
    方块之间的间距, 可用值范围为 <code>0</code> 到 <code>20</code>
    </td>
    <td>
      <code>1.2</code>
    </td>
  </tr>

  <tr>
    <td>scale</td>
    <td><code>number</code></td>
    <td>
      调整俯视的角度, 允许不小于 <code>1</code> 的数值
    </td>
    <td><code>2</code></td>
  </tr>

  <tr>
    <td>light</td>
    <td><code>number</code></td>
    <td>
      调整光照强度, 可用范围为 <code>1</code>
      到 <code>60</code>
    </td>
    <td><code>10</code></td>
  </tr>

  <tr>
    <td>gradient</td>
    <td><code>boolean</code></td>
    <td>
      为柱子使用渐变色模式
    </td>
    <td><code>false</code></td>
  </tr>

  <tr>
    <td>flatten</td>
    <td><code>number</code></td>
    <td>
      使用扁平模式，支持两种样式：
      <br>
      <code>1</code>: 所有方块都扁平化
      <br>
      <code>2</code>: 忽略空值
      <br>
      See <a href="#扁平模式">扁平模式示例</a>
    </td>
    <td>
      <code>0</code>
    </td>
  </tr>

  <tr>
    <td>animation</td>
    <td><code>enum</code></td>
    <td>启用动画, 见 <a href="#3dbar-动画">3dbar 动画</a></td>
    <td><code>undefined</td></td>
  </tr>


</table>

## 3dbar 动画

## 3dbar Animation

Enable animation by passing <code>animation</code> property, available values:

- `fall` (仅入场动画)
  ```
  chart=3dbar&weeks=20&flatten=1&animation=fall
  ```
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=fall&format=svg&dark=true">
    <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=fall&format=svg">
    <img src="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=fall&format=svg" width="400" />
  </picture>
- `raise` (仅入场动画)
  ```
  chart=3dbar&weeks=20&flatten=1&animation=raise
  ```

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=raise&format=svg&dark=true">
    <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=raise&format=svg">
    <img src="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=raise&format=svg" width="400" />
  </picture>
- `wave` (循环播放)
  ```
  chart=3dbar&weeks=20&flatten=1&animation=wave
  ```

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=wave&format=svg&dark=true">
    <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=wave&format=svg">
    <img src="https://ssr-contributions-svg.vercel.app/_/Catsjuice?chart=3dbar&weeks=20&flatten=1&animation=wave&format=svg" width="400" />
  </picture>


**自定义动画细节**: (在 url 中作为 `query` 参数传递)

<details>
  <summary>
    <code>fall</code> | <code>raise</code>
  </summary>
  <ul>
    <li>
      <code>animation_duration</code>
      <code>&lt;Number&gt;</code>
      动画持续时长，单位为秒
    </li>
    <li>
      <code>animation_delay</code>
      <code>&lt;Number&gt;</code>
      方块播放的间隔时长，单位为秒
    </li>
  </ul>
</details>

<details>
  <summary>
    <code>wave</code></code>
  </summary>
  <ul>
    <li>
      <code>animation_amplitude</code>
      <code>&lt;Number&gt;</code>
      <br>
      方块的移动范围，单位为像素（px）
    </li>
    <li>
      <code>animation_frequency</code>
      <code>&lt;Number&gt;</code>
      <br>
      方块移动频率，范围为 <code>[0.01, 0.5]</code>
    </li>
    <li>
      <code>animation_wave_center</code>
      <code>&lt;Number&gt;_&lt;Number&gt;</code>
      <br>
      波纹动画的中心点， 将坐标点 <code>x</code>, <code>y</code> 以 <code>${x}_${y}</code> 的格式传递(使用 <code>_</code> 拼接x, y)。例如：<code>0_0</code>
    </li>
  </ul>
</details>






## 暗黑模式

实际上，图表的显示由主题（ `theme` ）决定，而主题会被颜色（ `colors` ）属性覆盖。在这里启用暗黑模式，影响的是**内置主题的配色**和输出 `jpeg` 或 `html` 时的背景颜色，而其他输出格式下，背景都是透明的，暗黑模式下的主题色可参考 [主题](#主题)


## 图表

- **calendar**
  - 使用: `chart=calendar`
  - 示例
  
    ```
    https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=calendar&quality=0.3&format=svg
    ```

    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=calendar&format=svg&dark=true">
      <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=calendar&format=svg&dark=false">
      <img src="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=calendar&format=svg" width="400" />
    </picture>

- **3dbar**
  - 使用: `chart=3dbar`
  - 示例
  
    ```
    https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&quality=0.3&format=svg&gradient=true
    ```

    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&format=svg&dark=true">
      <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&format=svg">
      <img alt="3DBar" src="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&format=svg" width="400" />
    </picture>


## 主题

所有可用主题（实时更新）:

- `亮色模式`  
  <img src="https://ssr-contributions-svg.vercel.app/themes?format=svg&quality=0.5" >
- `暗黑模式`
  
  <img src="https://ssr-contributions-svg.vercel.app/themes?format=svg&quality=0.5&dark=true" >

## 使用场景

### 贴到 Notion 的页面中
  
  ![notion](./assets/notion.png)

### 作为 ios 小组件使用 [Scritable](https://apps.apple.com/cn/app/scriptable/id1405459188)

**示例代码:**

```js
let [chart, widgetSize, theme, weeks] = (args.widgetParameter || "")
  .split(",")
  .map((v) => v.trim());
chart = chart || "calendar";
widgetSize = widgetSize || "midium";
theme = theme || "green";
const darkMode = Device.isUsingDarkAppearance();
let url = `https://ssr-contributions-svg.vercel.app/_/CatsJuice?format=jpeg&quality=2&theme=${theme}&widget_size=${widgetSize}&chart=${chart}&dark=${darkMode}`;

if (weeks) url += `&weeks=${weeks}`;

let w = await createWidget();
Script.setWidget(w);

async function createWidget() {
  let w = new ListWidget();
  let random = (Math.random() * 100000000).toFixed(0);
  let data = await new Request(url + "&random=" + random).load();
  let image = Image.fromData(data);
  w.backgroundImage = image;
  return w;
}
```

添加 scriptable 小组件到桌面，并在组件设置中选择对应的脚本

**注意：**
以上脚本依赖于 `parameter` 参数的输入，依次填入 `chart`, `widgetSize`, `theme`, `weeks` 使用 `,` 分割, 以下是一些示例:

- `3dbar,large,,30`

  ```
  chart=3dbar&widgetSize=large&weeks=30
  ```
- `3dbar,,yellow_wine,20`

  ```
  chart=3dbar&theme=yellow_wine&weeks=20
  ```
- `,,blue`

  ```
  theme=blue
  ```
- `,small,purple`

  ```
  widgetSize=small&theme=purple
  ```

<br />
<div align="center">
  <img src="./assets/iphone11pro.png" alt="iPhone 11 Pro"/>
</div>

### 扁平模式

- `flatten=1&format=svg`
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&flatten=1&format=svg&dark=true&theme=native">
    <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&flatten=1&format=svg&dark=false&theme=native">
    <img src="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&flatten=1&format=svg&theme=native" width="400" />
  </picture>


- `flatten=2&format=svg`
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&flatten=2&format=svg&dark=true&theme=native">
    <source media="(prefers-color-scheme: light)" srcset="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&flatten=2&format=svg&dark=false&theme=native">
    <img src="https://ssr-contributions-svg.vercel.app/_/CatsJuice?chart=3dbar&flatten=2&format=svg&theme=native" width="400" />
  </picture>
