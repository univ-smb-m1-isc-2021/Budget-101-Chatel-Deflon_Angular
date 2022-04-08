import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public username!: string;

  constructor(
    public auth: AuthService,
    public userService: UserService,
    private router: Router
  ) {
    userService.getUser().subscribe((data: any) => {
      this.username = data.username;
    });
  }

  ngOnInit(): void {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/connexion']);
  }
}
