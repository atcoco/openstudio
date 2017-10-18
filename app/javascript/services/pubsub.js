const topics = {}

export const publish = (topic, info) => {
  if (Array.isArray(topics[topic])) {
    for (let listener of topics[topic]) {
      listener(info)
    }
  }
}

export const subscribe = (topic, listener) => {
  if (Array.isArray(topics[topic]) === false) {
    topics[topic] = []
  }
  const idx = topics[topic].push(listener) - 1
  const subscription = {
    remove: () => {
      topics[topic].splice(idx, 1)
      // prevent subscription's remove() to be called more than once
      subscription.remove = () => {}
    }
  }
  return subscription
}
