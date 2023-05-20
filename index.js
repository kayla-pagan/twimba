import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
let defaultTweetData = tweetsData
let storedTweetData = JSON.parse( localStorage.getItem('myTweetData') )

if (storedTweetData) {
    defaultTweetData = storedTweetData
    render()
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like)
       storeData()                
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
        storeData()
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        storeData()
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
        storeData()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = defaultTweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = defaultTweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    handleReplyBtnClick(replyId) 
}

function handleReplyBtnClick(replyId){
         
        const replyBtns = document.querySelectorAll('.reply-btn')
        
        replyBtns.forEach(function(replyBtn){
            replyBtn.addEventListener('click', (e) => {
                let replyIndex = defaultTweetData.findIndex(item => item.uuid === replyId)
                const replyInput = e.target.previousElementSibling.value
                defaultTweetData[replyIndex].replies.push(
                    {
                    handle: '@Scrimba',
                    profilePic: 'images/scrimbalogo.png',
                    tweetText: replyInput,
                    }
                )
                render()
                })
            })
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        defaultTweetData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function storeData(){
    localStorage.setItem('myTweetData', JSON.stringify(defaultTweetData))
}



function getFeedHtml(){
    let feedHtml = ``
    
    defaultTweetData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `
        <textarea placeholder="Tweet a Reply"></textarea>
        <button class="reply-btn">Reply</button>`
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

