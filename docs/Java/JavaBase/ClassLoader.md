# 类加载器

## 自定义

```java
import java.nio.file.Files;
import java.nio.file.Path;

public class LocalDiskClassLoader extends ClassLoader {

    private final Path path;

    public LocalDiskClassLoader(Path path) {
        this.path = path;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        if (name == null) {
            return null;
        }

        var namePath = name.replace('.', '/') + ".class";
        try {
            var bytes = Files.readAllBytes(path.resolve(namePath));
            return defineClass(name, bytes, 0, bytes.length);
        } catch (Exception _) {

        }
        return null;
    }
}
```