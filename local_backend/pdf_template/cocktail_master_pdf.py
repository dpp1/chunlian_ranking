pdf_template_cocktail_master = """
<!DOCTYPE html>
<html>
<head>
<script>

</script>
<style>
@page {
  size: A4;
  margin: 20mm;
}

body {
  background-image: url(${background_image});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 336.8mm; /* A4 height in millimeters */
  width: 238mm; /* A4 width in millimeters */
  text-align: center;
  color: black;
  font-family: SimSun;
  font-size: 24px;
  margin: 0;
}
.text {
  position: fixed;
  top: 280px;
  text-align: left;
  left: 60px;
  width: 200mm;
  color: var(--text-primary, #2E3333);
  font-family: IBM Plex Sans;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 150% */
  word-wrap: break-word;
}
.cocktail_name {
  color: var(--Black, #333);
  font-family: Passion One;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 116.667% */
}
.content {
  width: 820px;height: 1160px;margin: 0 auto;
}
.sub_topic {
  color: var(--text-primary, #2E3333);
  font-family: Amazon Ember;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: 24px;
}
</style>
</head>
<body>
<div class="content">

<pre class="text" >
<div class="cocktail_name">${cocktail_name}</div>
<pre class="sub_topic">原料:</pre>${cocktail_source} 
<pre class="sub_topic">制作步骤:</pre>${cocktail_production_step}
<pre class="sub_topic">特点:</pre>${cocktail_features}
</pre>

<h2 style="position:fixed;bottom:60px;left:0;right:0;font-size:18px;color:#7D623B;font-family:Apple Chancery;font-style:normal;font-weight:400;line-height:17px;">亚马逊云科技 Marketing Tech 荣誉出品</h2>
<img src="avatar.png" alt="二维码" style="width:100px;position:fixed;right:20px;bottom:60px;" >
</div>
</body>
</html>

"""