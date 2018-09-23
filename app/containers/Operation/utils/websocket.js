import readChunked from './readfile';


function sendfile(uri, blob, cbProgress) {
  return new Promise(
    (resolve, reject) => {
      const ipaddr = uri.ipaddr;
      const port = uri.port;
      const token = uri.token;
      let ws = null;
      try {
        ws = new WebSocket(`ws://${ipaddr}:${port}/?token=${token}`, ['binary']);
      } catch (err) {
        const error = new Error('webcoket连接失败');
        error.err = err;
        reject(error);
      }

      if (ws !== null) {
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
              msg = `WebSocket未关闭,事件类型:${type}`;
              ws.close();
              break;
          }
          reject(new Error(msg));
        };

        ws.onopen = () => {
          try {
            readChunked(
              blob,
              (chunk, offs, total) => {
                ws.send(chunk);
                if (cbProgress) cbProgress(offs / total);
              },
              (err) => {
                if (err) reject(err); else resolve(msg);
              });
          } catch (err) {
            const error = new Error('发送或读取文件失败');
            error.err = err;
            reject(error);
          }
        };
      }
    });
}


function readbuffer(uri, path, opencb, datacb, errorcb) {
  return new Promise(
    (resolve, reject) => {
      const ipaddr = uri.ipaddr;
      const port = uri.port;
      const token = uri.token;
      let ws = null;
      try {
        ws = new WebSocket(`ws://${ipaddr}:${port}/${path}?token=${token}`, ['binary']);
      } catch (err) {
        const error = new Error('webcoket连接失败');
        error.err = err;
        errorcb(error);
        reject(error);
      }

      if (ws !== null) {
        let msg;
        ws.onerror = (event) => {
          const type = event.type;
          switch (ws.readyState) {
            case WebSocket.CONNECTING:
              msg = `尝试连接ws://${ipaddr}:${port}失败,事件类型: ${type}`;
              break;
            case WebSocket.OPEN:
              msg = `WebSocket传输过程中发生异常,事件类型: ${type}`;
              break;
            case WebSocket.CLOSING:
              msg = `WebSocket关闭过程异常,事件类型: ${type}`;
              break;
            case WebSocket.CLOSED:
              msg = `WebSocket已经关闭,发生后续错误,事件类型: ${type}`;
              break;
            default:
              msg = `WebSocket未关闭,事件类型:${type}`;
              ws.close();
              break;
          }
          const err = new Error(msg);
          errorcb(err);
          reject(err);
        };

        ws.onopen = () => {
          opencb(ws);
        };

        ws.onmessage = (ev) => {
          try {
            datacb(ev.data);
          } catch (err) {
            errorcb(err);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket正常终止');
          datacb(null);
          resolve('closed');
        };
      }
    });
}

export { sendfile, readbuffer };

