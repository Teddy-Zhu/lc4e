package com.silentgo.lc4e.util.exception;

import com.silentgo.core.exception.AppException;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.util.exception
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/3.
 */
public class AppBusinessException extends AppException {

    public AppBusinessException(String message, int code) {
        super(message, code);
    }

    public AppBusinessException(int code) {
        super(code);
    }

    public AppBusinessException(String message) {
        super(message);
    }
}
