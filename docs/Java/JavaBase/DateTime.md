# 日期时间

## Date

```java
Date date = new Date();
// date: Thu Jun 12 22:18:43 GMT+08:00 2025

Date zero = new Date(0L);
// zero: Thu Jan 01 08:00:00 GMT+08:00 1970
```

`Date` 是一个和**时区**相关的类.

### Calendar

`Date` 类修改日期和时间的方法均已废弃, 若需根据某个 `Date` 实例修改需要借助 `Calendar`.

```java
Date zero = new Date(0L);
// zero: Thu Jan 01 08:00:00 GMT+08:00 1970

Calendar calendar = Calendar.getInstance();
calendar.setTime(zero);

// 加一年
calendar.add(Calendar.YEAR, 1);
// 加一月
calendar.add(Calendar.MONTH, 1);
// 加一天
calendar.add(Calendar.DAY_OF_MONTH, 1);
// 加一小时
calendar.add(Calendar.HOUR_OF_DAY, 1);
// 加一分钟
calendar.add(Calendar.MINUTE, 1);
// 加一秒
calendar.add(Calendar.SECOND, 1);
Date date = calendar.getTime();
// date: Tue Feb 02 09:01:01 GMT+08:00 1971
```

### SimpleDateFormat

将 `Date` 转为具有格式的字符串, 或者将符合格式的字符串转为 `Date`.

```java
Date zero = new Date(0L);
// zero: Thu Jan 01 08:00:00 GMT+08:00 1970

SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String zeroFormat = sdf.format(zero);
// zeroFormat: "1970-01-01 08:00:00"
Date zeroParse = sdf.parse(zeroFormat);
// zeroParse: Thu Jan 01 08:00:00 GMT+08:00 1970
```