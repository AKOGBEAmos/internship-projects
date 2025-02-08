package net.javaguides.springmvc.imageapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import net.javaguides.springmvc.imageapp.model.imageApp;

/**
 * @author Sp1der
 */
@Controller
public class imageAppController {

	@RequestMapping("/rapid7")
	public void vulnerable(imageApp model) {
	}
}

