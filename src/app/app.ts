import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  title = 'CinemaMax';

  private authService = inject(AuthService);

  ngOnInit() {
    // Garantir que o AuthService seja inicializado
    // Isso evita problemas quando a página é recarregada
  }
}
