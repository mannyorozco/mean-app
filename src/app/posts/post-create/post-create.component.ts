import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  public enteredTitle = '';
  public enteredContent = '';

  constructor(private postsService: PostsService) {}

  public onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postsService.addPost(form.value.title, form.value.content);
  }
}
