package com.merito.sistema_merito.controller;

import com.merito.sistema_merito.domain.entity.Cupom;
import com.merito.sistema_merito.service.ServicoResgate;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resgate")
public class ResgateController {

    private final ServicoResgate servicoResgate;

    public ResgateController(ServicoResgate servicoResgate) {
        this.servicoResgate = servicoResgate;
    }

    @PostMapping("/validar/{codigo}")
    public ResponseEntity<?> validar(@PathVariable("codigo") String codigo) {
        Cupom cupom = servicoResgate.validarCupom(codigo);
        return ResponseEntity.ok(Map.of(
                "codigoUnico", cupom.getCodigoUnico(),
                "utilizado", cupom.getUtilizado(),
                "dataGeracao", cupom.getDataGeracao()
        ));
    }
}
