import { Component } from '@angular/core';
import { NavigationComponent } from '../../../components/navigation/navigation.component';

@Component({
  selector: 'app-without-read-component',
  standalone: true,
  imports: [
    NavigationComponent
  ],
  templateUrl: './without-read-component.component.html',
  styleUrl: './without-read-component.component.css'
})
export class WithoutReadComponentComponent {

}
