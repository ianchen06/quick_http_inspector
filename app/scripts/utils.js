function lowerKey(obj) {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj = {}
    while (n--) {
        key = keys[n];
        newobj[key.toLowerCase()] = obj[key];
    }
    return newobj
}

function form2Json(formstr) {
    const res = {}
    const form_arr = formstr.split('&')
    for (const kv of form_arr) {
        const kv_arr = kv.split('=')
        const k = decodeURIComponent(kv_arr[0])
        const v = decodeURIComponent(kv_arr[1])

        res[k] = v
    }
    return res
}

function parseURL(url) {
    var result = {};
    var match = url.match(
        /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
    if (!match)
        return result;
    result.scheme = match[1].toLowerCase();
    result.host = match[2];
    result.port = match[3];
    result.path = match[4] || "/";
    result.fragment = match[5];
    return result;
}

module.exports = {
    'lowerKey': lowerKey,
    'form2Json': form2Json,
    'parseURL': parseURL
};