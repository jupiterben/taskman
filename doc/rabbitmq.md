### 公众号首发、欢迎关注[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%85%AC%E4%BC%97%E5%8F%B7%E9%A6%96%E5%8F%91%E6%AC%A2%E8%BF%8E%E5%85%B3%E6%B3%A8)

[![](https://img2020.cnblogs.com/blog/1496926/202109/1496926-20210905230522493-734400873.png)](https://img2020.cnblogs.com/blog/1496926/202109/1496926-20210905230522493-734400873.png)

### 什么是AMQP 和 JMS？[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E4%BB%80%E4%B9%88%E6%98%AFamqp-%E5%92%8C-jms)

__AMQP__：即Advanced Message Queuing Protocol，是一个应用层标准高级消息队列协议，提供统一消息服务。是应用层协议的一个开放标准，为面向消息的中间件设计。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同的开发语言等条件的限制。__Erlang中的实现有RabbitMQ__等。

__JMS__：即Java消息服务（Java Message Service）__应用程序接口__，由sun公司提出，并且sun公司定义好了接口。包括create、send、recieve。只要想使用它，就得实现它定义的接口。 消息服务是一个与具体平台无关的API，绝大多数MOM提供商都对JMS提供支持。不好的地方是语言层面的限制，只能为JAVA，这其实稍微有点和微服务的观点相违背。要求语言只能是JAVA，而不能是py等。

  

### 常见的MQ产品[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%B8%B8%E8%A7%81%E7%9A%84mq%E4%BA%A7%E5%93%81)

ActiveMQ：基于JMS，Apache

RocketMQ：（Rocket，火箭）阿里巴巴的产品，基于JMS，目前由Apache基于会维护

Kafka：分布式消息系统，亮点：吞吐量超级高，没秒中数十万的并发。

RabbitMQ：（Rabbit，兔子）由erlang语言开发，基于AMQP协议，在erlang语言特性的加持下，RabbitMQ稳定性要比其他的MQ产品好一些，而且erlang语言本身是面向高并发的编程的语言，所以RabbitMQ速度也非常快。且它基于AMQP协议，对分布式、微服务更友好。

  

### 安装RabbitMQ[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%AE%89%E8%A3%85rabbitmq)

安装使用的rpm包我提前准备好了，如下：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161943872-73638100.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161943872-73638100.png)

> 操作系统：Centos7.3
> 
> 推荐：这三个包我提前下载好了，关注白日梦的公众号（文末有二维码），后台回复：rbmq 可以直接领取。
> 
> 如果你不怕麻烦也想自己参照文档自行下载，可参考文末的链接。

科普一下：

比如你安装软件A，结果这个软件可能依赖了软件B，于是你直接安装A就会接到报错，说当前操作系统环境中缺少软件B，让你先安装软件B后，再尝试安装软件A。

如果你看过Linux私房菜类似书，其实你应该也知道，rmp其实已经处理好各种依赖关系的软件包，所以安装起来相对来说是比较省心的。

```

yum install esl-erlang_23.0-1_centos_7_amd64.rpm -y
yum install esl-erlang-compat-18.1-1.noarch.rpm -y


rpm -ivh rabbitmq-server-3.8.9-1.el7.noarch.rpm
```

比如遇到如下的安装包错，按提示解决就好了

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161944779-1608734955.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161944779-1608734955.png)

下载依赖后重试即可完成安装。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161945522-1464609833.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161945522-1464609833.png)

  

### 启动RabbitMQ[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%90%AF%E5%8A%A8rabbitmq)

通过如下命令可启动：

```
service rabbitmq-server start
```

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161946301-1281632515.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161946301-1281632515.png)

> 你可以像上面这样，安装之后立刻启动。
> 
> 这时rabbitmq使用的是默认的配置参数。但是一般都来说我们都希望rabbitmq能使用我们可修改的配置文件启动，这样也方便我们后续对mq的控制，下面就一起看一rabbitmq的认证、授权、访问控制、配置文件。

你还可以像下面这样开启web插件。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161947200-884527400.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161947200-884527400.png)

开启web管理模块插件之后访问：[http://服务器的ip:15672/](http://xn--ip-fr5c86lx7z0gv:15672/) 可以找到登陆入口。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161948163-2105817475.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161948163-2105817475.png)

设置rabbitmq开机启动：

```
chkconfig rabbitmq-server on
```

  

### 什么是Authentication（认证）[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E4%BB%80%E4%B9%88%E6%98%AFauthentication%E8%AE%A4%E8%AF%81)

RabbitMQ启动之后，我们想使用它的前提是用username、password连接上它。这里所说的username和passowrd其实就是一个被授予一定权限的用户。

用户连接上RabbitMQ即可创建virtual host使用MQ。在说什么是virtual host之前，先说下RabbitMQ默认有的被授权的用户：username=guest、password=guest、virtualhost=/。

但是这个用户被限制了只能在RabbitMQ所在机器的本地才能登陆MQ（不允许你使用该用户通过ip+port远程登录RabbitMQ），就像下面这样：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161949186-435456449.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161949186-435456449.png)

> 你使用特定的用户去连接MQ的过程即为Authentication

  

### 指定RabbitMQ的启动配置文件[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E6%8C%87%E5%AE%9Arabbitmq%E7%9A%84%E5%90%AF%E5%8A%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

rabbitmq提供给我们一个配置文件模版，默认在：`/usr/share/doc/rabbitmq-server-xxx/rabitmq.conf.example`

如果你没有找到的话也没关系，去github上拷贝一份模版配置，手动创建 `/etc/rabbitmq/rabbitmq.conf` 配置文件，然后将你拷贝的配置放进去也是ok的。

rabbitmq github addr：[https://github.com/rabbitmq/rabbitmq-server/blob/v3.8.9/docs/](https://github.com/rabbitmq/rabbitmq-server/blob/v3.8.9/docs/)

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161951182-1995324790.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161951182-1995324790.png)

> 涉及到的都是基础的shell命令，不再赘述。
> 
> 注意文件名为：rabbitmq.config，且要放在/etc/rabbitmq目录下。

  

### 如何让guest用户远程登陆RabbitMQ[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%A6%82%E4%BD%95%E8%AE%A9guest%E7%94%A8%E6%88%B7%E8%BF%9C%E7%A8%8B%E7%99%BB%E9%99%86rabbitmq)

可以像下面这样修改你的MQ的配置文件：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161952296-434923127.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161952296-434923127.png)

然后通过service命令重启MQ，在web页面尝试登陆，接着你会成功登陆：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161954494-1546608916.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161954494-1546608916.png)

> 官方：强烈不建议允许默认的用户可远程登陆MQ，用过RabbitMQ的程序员都知道默认用户名和密码是啥，这会让你的系统的安全性大大降低！
> 
> 推荐的做法是：删除默认用户、使用新的安全凭证创建新的用户

  

### 管理用户和权限[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E7%AE%A1%E7%90%86%E7%94%A8%E6%88%B7%E5%92%8C%E6%9D%83%E9%99%90)

其实文章看到这里，什么是用户？什么是权限？你肯定已经非常清楚了。

那什么是管理用户和权限？很简单，就比如：添加/删除 User，这个User可能属于某个业务线，有了User可以使用RabbitMQ这款中间件软件。以及为User分配他能读写的virtual host。

> 下一小节我们会细说什么是 virtual host

__本小节主要是通过实验的方式展开，实战Rabbit的用户和权限管理！__

__主要有两种方式：__

\*\*1、通过web控制台管理 \*\*

__2、通过cli命令行管理__

因为我们刚才允许guest这个超级管理员可以远程登陆MQ，于是你可以像下图这样在web页面上管理用户，比如我可以为业务线A，新添加一个用户changwu01，并且给他administrator的权限，然后这个业务线通过该用户使用MQ。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161955945-1616483470.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161955945-1616483470.png)

你也可以像下面这样使用cli，通过命令行的方式添加用户：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161956697-216581493.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161956697-216581493.png)

然后使用该用户尝试登陆，你会发现：报错了，说白日梦01不是管理员。不能登陆控制台。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161957474-84312613.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161957474-84312613.png)

如果你实战一下，现将bairimeng01的权限tags改成management，再尝试登陆，它会提示你说：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161958451-327055998.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161958451-327055998.png)

所以，这时你可以直接使用guest用户登陆，然后将bairimeng01的权限改成：administrator

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161959582-418888312.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206161959582-418888312.png)

然后修改bairiemeng01的权限，并点击update user

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162002559-703292331.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162002559-703292331.png)

修改之后重新使用bairimeng01登陆：

你会发现bairimeng01可以成功登陆！

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162004268-1947252850.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162004268-1947252850.png)

查看当前RabbitMQ有哪些用户：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162006277-1114067871.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162006277-1114067871.png)

通过命令行创建用户airimeng03、并通过命令行让白日梦03有对virtualhost=/有读写权

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162006991-553395636.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162006991-553395636.png)

可以通过控制台确认一下，我们的配置确实生效了。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162008143-793402115.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162008143-793402115.png)

  

### RabbitMQ中的概念[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#rabbitmq%E4%B8%AD%E7%9A%84%E6%A6%82%E5%BF%B5)

  

#### 什么是virtual host[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E4%BB%80%E4%B9%88%E6%98%AFvirtual-host)

可以通过MySQL和MySQL中的数据库来理解RabbitMQ和virtual host的关系。

MySQL大家都不陌生，经常会出现多个业务线混用一个MySQL数据库的情况，就像下图这样，每个业务线都在MySQL中创建自己的数据库，使用时各自往各自的数据库中存储数据，彼此相互不干涉。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162008852-1886576080.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162008852-1886576080.png)

RabbitMQ和virtual host的关系也差不多，可以让多个业务线同时使用一个RabbitMQ，只要为业务线各个业务线绑定上不同的virtual host即可：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162009680-1992407247.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162009680-1992407247.png)

  

#### 创建virtual host 并指定用户可以使用它[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%88%9B%E5%BB%BAvirtual-host-%E5%B9%B6%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%E5%AE%83)

Step1:

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162010556-1179446240.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162010556-1179446240.png)

Step2:

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162011544-793083561.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162011544-793083561.png)

Step3:

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162012923-103289151.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162012923-103289151.png)

Step4: 校验

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162016640-682825445.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162016640-682825445.png)

  

### RabbitMQ的五种消息模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#rabbitmq%E7%9A%84%E4%BA%94%E7%A7%8D%E6%B6%88%E6%81%AF%E6%A8%A1%E5%9E%8B)

RabbitMQ支持以下五种消息模型，第六种RPC本质上是服务调用，所以不算做服务通信消息模型。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162020922-723030915.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162020922-723030915.png)

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162022288-710990876.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162022288-710990876.png)

  

#### Hello World[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#hello-world)

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125542629-2135674001.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125542629-2135674001.png)

P（producer/ publisher）：生产者，发送消息的服务

C（consumer）：消费者，接收消息的服务

红色区域就是MQ中的Queue，可以把它理解成一个邮箱

-   首先信件来了不强求必须马上马去拿
-   其次,它是有最大容量的(受主机和磁盘的限制,是一个缓存区)
-   允许多个消费者监听同一个队列，争抢消息

  

#### Worker模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#worker%E6%A8%A1%E5%9E%8B)

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125528529-1014015990.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125528529-1014015990.png)

Worker模型中也只有一个工作队列。但它是一种竞争消费模式。可以看到同一个队列我们绑定上了多个消费者，消费者争抢着消费消息，__这可以有效的避免消息堆积__。

比如对于短信微服务集群来说就可以使用这种消息模型，来了请求大家抢着消费掉。

如何实现这种架构：对于上面的HelloWorld这其实就是相同的服务我们启动了多次罢了，自然就是这种架构。

  

#### 订阅模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E8%AE%A2%E9%98%85%E6%A8%A1%E5%9E%8B)

订阅模型借助一个新的概念：Exchange（交换机）实现，不同的订阅模型本质上是根据交换机(Exchange)的类型划分的。

订阅模型有三种

1.  Fanout（广播模型）: 将消息发送给绑定给交换机的所有队列(因为他们使用的是同一个RoutingKey)。
2.  Direct（定向）: 把消息发送给拥有指定Routing Key (路由键)的队列。
3.  Topic（通配符）: 把消息传递给拥有 符合Routing Patten(路由模式)的队列。

  

##### 订阅之Fanout模型

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125522017-1931971535.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125522017-1931971535.png)

这个模型的特点就是它在发送消息的时候,并没有指明Rounting Key , 或者说他指定了Routing Key,但是所有的消费者都知道,大家都能接收到消息,就像听广播。

  

##### 订阅之Direct模型

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162023832-709293422.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162023832-709293422.png)

P：生产者，向Exchange发送消息，发送消息时，会指定一个routing key。

X：Exchange（交换机），接收生产者的消息，然后把消息递交给 与routing key完全匹配的队列

C1：消费者，其所在队列指定了需要routing key 为 error 的消息

C2：消费者，其所在队列指定了需要routing key 为 info、error、warning 的消息

拥有不同的RoutingKey的消费者，会收到来自交换机的不同信息，而不是大家都使用同一个Routing Key 和广播模型区分开来。

  

##### 订阅之Topic模型

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162025176-1413299944.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162025176-1413299944.png)

类似于Direct模型。区别是Topic的Routing Key支持通配符。

\### JAVA客户端

__后台回复：rbmq 即可获取如下资料：__

本文中涉及到的：Golang Case、Java Case以及erlang虚拟机rpm包、rabbitmq-server的rpm包等软件，直接通过yum安装即可。

  

#### Hello World[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#hello-world-1)

在本小节中你可以重点看一下当你通过代码建立连接、创建channel、发送消息、接受消息的同时，在web view中，都有何变化。

Send.java：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162027761-836963960.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162027761-836963960.png)

查看新创建的连接：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162029902-1979813015.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162029902-1979813015.png)

查看新创建的通道：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162031048-514403959.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162031048-514403959.png)

查看RabbitMQ中消息的传送状态：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162032972-618368741.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162032972-618368741.png)

Recv.java:

执行如下的消息接受者，可以收到发送过来的消息。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162034779-1703258400.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162034779-1703258400.png)

再去web view中观察RabbitMQ中消息的消费状态：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162039411-1020592218.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162039411-1020592218.png)

查看系统中连接的状态，由于我没有显示的关闭连接和channl，所以你能看到系统中有两个连接：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162041413-1940089877.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162041413-1940089877.png)

channel也还存在：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162042914-1274161594.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162042914-1274161594.png)

  

#### Worker模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#worker%E6%A8%A1%E5%9E%8B-1)

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125528529-1014015990.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125528529-1014015990.png)

本质上是相同的服务我们启动了多次罢了，自然就是这种架构。

补充点1：可以给队列添加一条属性，不再是队列把任务平均分配开给消费者。而是让消费者消费完了后，问队列要新的任务，这样能者多劳。

```

channel.basicQos(1);
```

补充点2：接受者接受消息时，可以像下图这样配置手动ACK

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162044798-1424240893.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162044798-1424240893.png)

  

#### 订阅模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E8%AE%A2%E9%98%85%E6%A8%A1%E5%9E%8B-1)

订阅模型借助一个新的概念：Exchange（交换机）实现，不同的订阅模型本质上是根据交换机(Exchange)的类型划分的。

订阅模型有三种

1.  Fanout（广播模型）: 将消息发送给绑定给交换机的所有队列(因为他们使用的是同一个RoutingKey)。
2.  Direct（定向）: 把消息发送给拥有指定Routing Key (路由键)的队列。
3.  Topic（通配符）: 把消息传递给拥有 符合Routing Patten(路由模式)的队列。

  

##### 订阅之Fanout模型

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125522017-1931971535.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125522017-1931971535.png)

这个模型的特点就是它在发送消息的时候，并没有指明Rounting Key ，或者说他指定了Routing Key，但是所有的消费者都知道，大家都能接收到消息,就像听广播。

发送者：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162046322-1541772302.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162046322-1541772302.png)

去web view中查看状态：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162049035-1994412893.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162049035-1994412893.png)

运行接受者消费消息

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162100938-754682181.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162100938-754682181.png)

  

##### 订阅之Direct模型

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162101853-1932156693.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162101853-1932156693.png)

和Fanout模型相似，发送方发送时：指定了routingkey如下

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162103919-1599898003.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162103919-1599898003.png)

接收方接受时，也指定了routingkey如下：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162105037-1970188598.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162105037-1970188598.png)

  

##### 订阅之Topic模型

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162106143-697514166.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162106143-697514166.png)

topic模型和direc模型相似。

区别：交换机的类型：topic、routingkey：支持正则表达式

发送者：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162107035-136786792.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162107035-136786792.png)

接收者：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162108920-1603038968.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162108920-1603038968.png)

  

#### 消息确认机制[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E6%B6%88%E6%81%AF%E7%A1%AE%E8%AE%A4%E6%9C%BA%E5%88%B6)

  

##### ACK机制

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162109581-1996261690.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162109581-1996261690.png)

所谓的ACK确认机制：

自动ACK：消费者接收到消息后自动发送ACK给RabbitMQ。

手动ACK：我们手动控制消费者接收到并成功消息后发送ACK给RabbitMQ。

你可以看上图：如果使用自动ACK，当消息者将消息从channel中取出后，RabbitMQ随即将消息给删除。接着不幸的是，消费者没来得及处理消息就挂了。那也就意味着消息其实丢失了。

你可能会说：会不会存在重复消费的情况呢？这其实就不是MQ的问题了。你完全可以在你代码的逻辑层面上进行诸如去重、插入前先检查是否已存在等逻辑规避重复消费问题。

具体的实现方式可以参考上面的：JAVA客户端/Worker模型

  

##### 持久化交换机

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162110162-847281033.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162110162-847281033.png)

  

##### 持久化队列

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162110748-548903954.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162110748-548903954.png)

  

##### 持久化消息

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162111757-631883304.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162111757-631883304.png)

  

#### SpringAMQP[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#springamqp)

SpringAMQP帮我们实现了--生产者确认机制,对于不可路由的消息交换机会告诉生产者,使其重新发送

  

##### 环境搭建

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162112803-2731222.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162112803-2731222.png)

配置文件：生产者

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162113888-1601344803.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162113888-1601344803.png)

生产者使用__AmqpTemplate模板__发送消息

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162115231-1187736385.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162115231-1187736385.png)

消费端不需要AmqpTemplate模板发送消息,因此不配置

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162116366-1335675051.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162116366-1335675051.png)

virtual-host，和当前用户绑定的虚拟主机名， 这就Oralce里面,不同限权的用户可以看到的界面，拥有的能力是不用的，在RabbitMQ中，用户只能看到和它相关的虚拟主机下面的信息。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162117369-627723356.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162117369-627723356.png)

  

### Golang客户端[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#golang%E5%AE%A2%E6%88%B7%E7%AB%AF)

__关注白日梦，后台回复：rbmq 即可获取如下资料：__

本文中涉及到的：Golang Case、Java Case以及erlang虚拟机rpm包、rabbitmq-server的rpm包等软件，直接通过yum安装即可。

文末有二维码

下载依赖包：

```
go get github.com/streadway/amqp
```

  

#### Hello World[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#hello-world-2)

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125542629-2135674001.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125542629-2135674001.png)

发送端：

Step1: 获取连接: Dial最后面的`//test` 比较迷惑，其实`/test`是我的virtualhost，如果只写成/host会把错说：`"no access to this vhost"`

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162118616-1762612874.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162118616-1762612874.png)

Step2: 创建channel

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162119555-1560946511.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162119555-1560946511.png)

Step3: 声明queue，后续往这个队列中发送消息

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162120454-1005447851.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162120454-1005447851.png)

Step5: 发送消息

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162121546-20732866.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162121546-20732866.png)

接受端：

消费者同样需要建立连接和channel、然后声明我们想消费的channel，和上面的生产者代码相同，就不粘出来了。

消费者从channel中接受消息：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162122634-1185039633.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162122634-1185039633.png)

处理消息：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162123495-152901770.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162123495-152901770.png)

  

#### Worker 模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#worker-%E6%A8%A1%E5%9E%8B)

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125528529-1014015990.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125528529-1014015990.png)

同样的Worker模型和Simple模型也是相似的。无外乎是simple模型的消费者启动了多个实例。

__消息分发策略__：默认情况下RabbitMQ后将P生产的消息以round-robin的策略分发给C1、C2。

你也可以像下图这样设置一个相对公平的分发策略: 当消费者把消息处理完后MQ才会给他新的消息，这样可以实现能者多劳。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162126453-2081093643.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162126453-2081093643.png)

__消息确认机制__：

什么是ACK机制，你可以往下翻看 Golang客户端/消息确认机制/ACK机制部分的描述。

如果手动ACK如下：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162131489-982184542.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162131489-982184542.png)

当我们像上面这样设置手动ACK之后，可以确保如果消费者没处理完消息就挂了，MQ中的消息不会丢失。

但是如果这时MQ挂了，消息同样会丢失。

为了避免这种情况，可以将设置将MQ中的消息也持久化

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162133103-2106115237.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162133103-2106115237.png)

  

#### 订阅模型[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E8%AE%A2%E9%98%85%E6%A8%A1%E5%9E%8B-2)

订阅模型借助一个新的概念：Exchange（交换机）实现，不同的订阅模型本质上是根据交换机(Exchange)的类型划分的。

订阅模型有三种

1.  Fanout（广播模型）: 将消息发送给绑定给交换机的所有队列(因为他们使用的是同一个RoutingKey)。
2.  Direct（定向）: 把消息发送给拥有指定Routing Key (路由键)的队列。
3.  Topic（通配符）: 把消息传递给拥有 符合Routing Patten(路由模式)的队列。

  

##### 订阅模型之Fanout模型

[![](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125522017-1931971535.png)](https://img2018.cnblogs.com/blog/1496926/201907/1496926-20190708125522017-1931971535.png)

这个模型的特点就是它在发送消息的时候，并没有指明Rounting Key ， 或者说他指定了Routing Key，但是所有的消费者都知道，大家都能接收到消息,就像听广播。

生产者：在获取channel之后紧接着创建一个交换机，交换机的类型为 fanout 扇出。

注意，fanout对应的routingkey（路由key为空）

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162138515-433232868.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162138515-433232868.png)

消费者：需要消费者获取到channel后也要声明交换机。消费者的queue无名称，queue没有routingkey。注意交换机的名字别写错。

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162140235-1447894593.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162140235-1447894593.png)

  

##### 订阅模型之Direct模型

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162141800-646293539.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162141800-646293539.png)

生产者：和Fanout类似，注意交换机的名称为direct 以及添加 特定的routingkey

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162142798-374092395.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162142798-374092395.png)

消费者：

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162143803-1234629713.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162143803-1234629713.png)

  

##### 订阅模型之Topic模型

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162144760-1606745935.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162144760-1606745935.png)

和Direct模型相似，不同点：type为topic、并别routingkey支持正则表达式。

详细代码不再重复贴了。可以自行领取源码学习。

  

#### 消息确认机制[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E6%B6%88%E6%81%AF%E7%A1%AE%E8%AE%A4%E6%9C%BA%E5%88%B6-1)

  

##### ACK机制

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162145404-1946623920.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162145404-1946623920.png)

所谓的ACK确认机制：

自动ACK：消费者接收到消息后自动发送ACK给RabbitMQ。

手动ACK：我们手动控制消费者接收到并成功消息后发送ACK给RabbitMQ。

你可以看上图：如果使用自动ACK，当消息者将消息从channel中取出后，RabbitMQ随即将消息给删除。接着不幸的是，消费者没来得及处理消息就挂了。那也就意味着消息其实丢失了。

你可能会说：会不会存在重复消费的情况呢？这其实就不是MQ的问题了。你完全可以在你代码的逻辑层面上进行诸如去重、插入前先检查是否已存在等逻辑规避重复消费问题。

具体的实现方式可以参考上面的Golang或JAVA客户端的Worker模型部分。

  

##### 持久化交换机

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162146117-655440242.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162146117-655440242.png)

  

##### 持久化队列

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162146908-207929431.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162146908-207929431.png)

  

##### 持久化消息

[![](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162147852-227479855.png)](https://img2020.cnblogs.com/blog/1496926/202012/1496926-20201206162147852-227479855.png)

  

### 资料获取[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E8%B5%84%E6%96%99%E8%8E%B7%E5%8F%96)

[![](https://img2020.cnblogs.com/blog/1496926/202011/1496926-20201115123042357-889631116.jpg)](https://img2020.cnblogs.com/blog/1496926/202011/1496926-20201115123042357-889631116.jpg)

本文中涉及到的：Golang Case、Java Case以及erlang虚拟机rpm包、rabbitmq-server的rpm包等软件，直接通过yum安装即可。  
关注后台回复：rbmq 即可获取如下资料：

参考：

官网：[https://www.rabbitmq.com/](https://www.rabbitmq.com/)

get start：[https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)

download rabbitmq：[https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)

rabbitmq和erlang版本对应关系：[https://www.rabbitmq.com/which-erlang.html](https://www.rabbitmq.com/which-erlang.html)

download erlang：[https://www.erlang-solutions.com/resources/download.html](https://www.erlang-solutions.com/resources/download.html)

rabbitmq推荐的erlang：[https://www.rabbitmq.com/releases/erlang/](https://www.rabbitmq.com/releases/erlang/)

了解更多rabbitmq3.8.X配置：[https://www.cnblogs.com/masy-lucifer/p/13551067.html](https://www.cnblogs.com/masy-lucifer/p/13551067.html)

rabbitmq3.8.9 GitHub:[https://github.com/rabbitmq/rabbitmq-server/tree/v3.8.9/docs](https://github.com/rabbitmq/rabbitmq-server/tree/v3.8.9/docs)

认证、授权、访问控制：[https://www.rabbitmq.com/access-control.html](https://www.rabbitmq.com/access-control.html)

### 公众号首发、欢迎关注[#](https://www.cnblogs.com/ZhuChangwu/p/14093107.html#%E5%85%AC%E4%BC%97%E5%8F%B7%E9%A6%96%E5%8F%91%E6%AC%A2%E8%BF%8E%E5%85%B3%E6%B3%A8-1)

[![](https://img2020.cnblogs.com/blog/1496926/202109/1496926-20210905230522493-734400873.png)](https://img2020.cnblogs.com/blog/1496926/202109/1496926-20210905230522493-734400873.png)