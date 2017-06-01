import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { getTweetLength } from 'twitter-text';

import { tweetValidator } from './tweetValidator';
import { TwitterProvider } from '../../providers/twitter/twitter';
/**
 * Generated class for the TweetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tweet',
  templateUrl: 'tweet.html',
})
export class TweetPage {
  maxCharacter: number = 140;
  tweetForm: FormGroup;
  characterCount$: Observable<number>;
  @ViewChild('textarea') textarea;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public twitter: TwitterProvider,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
  ) {
    this.tweetForm = this.formBuilder.group({
      tweet: ['', [Validators.required, tweetValidator]],
    });
    this.characterCount$ = this.tweetForm.valueChanges
      .map(({ tweet }) => this.maxCharacter - getTweetLength(tweet));
  }

  ionViewDidLoad() {
    this.textarea.setFocus();
  }

  ionViewDidLeave() {

  }

  tweet() {
    this.twitter.tweet(this.tweetForm.value.tweet).subscribe(() => {
      this.toastCtrl.create({
        message: 'Tweet sent!',
        duration: 3000
      }).present();
      this.dismiss();
    }, () => {
      this.toastCtrl.create({
        message: 'Something wrong happened, please try again!',
        duration: 3000
      }).present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}