local _M = {}

function _M.get_ja3_hash()
    -- Simple fingerprint based on User-Agent and IP
    local ua = ngx.req.get_headers()["User-Agent"] or ""
    local hash = ngx.md5(ua .. ngx.var.remote_addr)
    return hash
end

return _M
