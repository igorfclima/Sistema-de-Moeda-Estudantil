package com.merito.sistema_merito.exception;

public class VantagemIndisponivelException extends RuntimeException {

    public VantagemIndisponivelException(String mensagem) {
        super(mensagem);
    }

    public VantagemIndisponivelException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
