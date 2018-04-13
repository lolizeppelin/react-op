import readChunked from './readfile';


function sendfile(uri, blob, cbProgress) {
  return new Promise(
    (resolve, reject) => {
      const ipaddr = uri.ipaddr;
      const port = uri.port;
      const ws = new WebSocket(`ws://${ipaddr}:${port}`, ['binary']);
      ws.binaryType = 'arraybuffer';
      let msg = '文件发送完毕';

      ws.onerror = (event) => {
        const type = event.type;
        switch (ws.readyState) {
          case WebSocket.CONNECTING:
            msg = `尝试连接ws://${ipaddr}:${port}失败,事件类型:${type}`;
            break;
          case WebSocket.OPEN:
            msg = `WebSocket传输过程中发生异常,事件类型:${type}`;
            break;
          case WebSocket.CLOSING:
            msg = `WebSocket关闭过程异常,事件类型:${type}`;
            break;
          case WebSocket.CLOSED:
            msg = `WebSocket已经关闭,发生后续错误,事件类型:${type}`;
            break;
          default:
            break;
        }
      };

      ws.onopen = () => {
        readChunked(
          blob,
          (chunk, offs, total) => {
            ws.send(chunk);
            if (cbProgress) cbProgress(offs / total);
          },
          (err) => {
            if (err) reject(err); else resolve(msg);
          });
      };
    });
}


export { sendfile };

