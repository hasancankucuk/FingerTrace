local _M = {}

function _M.get_ja3_hash()
    -- Get User-Agent and IP
    local ua = ngx.req.get_headers()["User-Agent"] or "unknown"
    local ip = ngx.var.remote_addr or "unknown"
    
    -- Debug logging
    ngx.log(ngx.INFO, "JA3 Module - UA: " .. ua)
    ngx.log(ngx.INFO, "JA3 Module - IP: " .. ip)

    -- Create a simple hash
    local combined = ua .. "|" .. ip .. "|" .. ngx.time()
    local hash = ngx.md5(combined)
    
    ngx.log(ngx.INFO, "JA3 Module - Generated hash: " .. hash)

    return hash
end

return _M
