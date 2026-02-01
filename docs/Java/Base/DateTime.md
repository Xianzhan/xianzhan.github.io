# 时间

## 时区

```java
String[] availableIds = TimeZone.getAvailableIDs();
// availableIds: [America/New_York, Asia/Shanghai, GMT, UTC, ...]

TimeZone tzDefault = TimeZone.getDefault();
// tzDefault.getID(): Asia/Shanghai

Date now = new Date(0);
// now: Thu Jan 01 08:00:00 CST 1970

// 转换纽约时间
TimeZone.setDefault(TimeZone.getTimeZone("America/New_York"));
// now: Wed Dec 31 19:00:00 EST 1969
```

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

## java.time

> @since 8 [JEP 150: Date & Time API](https://openjdk.org/jeps/150)

`java.time` 包下的所有类都是不可变类型且线程安全.

- 日期与时间
    - `LocalDate`: 仅表示日期，如 `1970-01-01`
    - `LocalTime`: 仅表示时间，如 `08:00:00.000`
    - `LocalDateTime`: 表示日期和时间，如 `1970-01-01 08:00:00.000`
    - `ZonedDateTime`: 表示日期和时间，并带有时区信息，如 `1970-01-01T08:00:00.000+08:00[Asia/Shanghai]`
- 时间戳
    - `Instant`: 时间戳，如 `1970-01-01T00:00:00Z`
- 时区
    - `ZoneId`: 时区 ID，如 `Asia/Shanghai`
- 持续时间
    - `Duration`: 以秒或纳秒为单位的时间间隔，如 `PT1H`
    - `Period`: 以年、月、日为单位的时间间隔，如 `P1Y1M1D`
- 日期时间格式化
    - `DateTimeFormatter`: 日期时间格式化器，如 `yyyy-MM-dd HH:mm:ss`