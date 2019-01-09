import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  public enteredTitle = '';
  public enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  public onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };

    this.postCreated.emit(post);
  }
}
