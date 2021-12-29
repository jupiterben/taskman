Rabbitmq本身是没有延迟队列的，要实现延迟消息，一般有两种方式：

1.通过Rabbitmq本身队列的特性来实现，需要使用Rabbitmq的死信交换机（Exchange）和消息的存活时间TTL（Time To Live）。 2.在rabbitmq 3.5.7及以上的版本提供了一个插件（rabbitmq-delayed-message-exchange）来实现延迟队列功能。同时插件依赖Erlang/OPT 18.0及以上。

AMQP协议，以及RabbitMQ本身没有直接支持延迟队列的功能，但是可以通过TTL和DLX模拟出延迟队列的功能。

__TTL（Time To Live）__

RabbitMQ可以针对Queue和Message设置 x-message-tt，来控制消息的生存时间，如果超时，则消息变为dead letter

RabbitMQ针对队列中的消息过期时间有两种方法可以设置。

A: 通过队列属性设置，队列中所有消息都有相同的过期时间。 B: 对消息进行单独设置，每条消息TTL可以不同。 如果同时使用，则消息的过期时间以两者之间TTL较小的那个数值为准。消息在队列的生存时间一旦超过设置的TTL值，就成为dead letter

详细可以参考：RabbitMQ之TTL（Time-To-Live 过期时间）

__DLX (Dead-Letter-Exchange)__

RabbitMQ的Queue可以配置x-dead-letter-exchange 和x-dead-letter-routing-key（可选）两个参数，如果队列内出现了dead letter，则按照这两个参数重新路由。

x-dead-letter-exchange：出现dead letter之后将dead letter重新发送到指定exchange x-dead-letter-routing-key：指定routing-key发送 队列出现dead letter的情况有：

消息或者队列的TTL过期 队列达到最大长度 消息被消费端拒绝（basic.reject or basic.nack）并且requeue=false 利用DLX，当消息在一个队列中变成死信后，它能被重新publish到另一个Exchange。这时候消息就可以重新被消费。

