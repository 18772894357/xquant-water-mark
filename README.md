
## 纯JS打造前端水印
+ 使用canvas绘制文案，最终生成image添加再页面中
+ 自动计算文本宽高，可以设置文本之间间距
+ 可防止篡改，设置监听元素功能

---

## 参数说明

|参数|说明|默认|
|----|----|----|
|text|需要绘制的文本| 无|
|fontSize|字体大小|14|
|fontFamily|字体|YaHei|
|angle|旋转角度|0|
|opcity|透明度|1|
|observer|是否监听串改|true|
|pdding|绘制文本之间的间距|0|
|color|文本颜色|#333|
|left|左边距|0|
|top|上边距|0|
|right|右边距|0|
|bottom|下边距|0|
|width|宽度|浏览器宽度|
|height|高度|浏览器高度|